---
title: 'Why Many Python Libraries Are Mainly Written in C'
slug: 'why-python-libraries-written-in-c'
description: "The engineering reasons behind Python's C extension ecosystem — from the GIL and CPython internals to why NumPy, pandas, and PyTorch are C/C++ at their core."
author: 'Jerome Wolff'
publishedAt: 2026-05-26
updatedAt: 2026-05-26
tags: ['python', 'cpython', 'c-extensions', 'performance', 'systems-programming', 'numpy']
category: 'Software Engineering'
featuredImage: '/images/blog/python.svg'
draft: false
---

## Python Is a Great Orchestrator. C Is the Engine.

The scientific Python stack — NumPy, pandas, SciPy, PyTorch, Pillow,
cryptography — is written in C, C++, or Fortran at its performance-critical
core. Python is the interface. Understanding why is understanding CPython's
fundamental architecture.

## The CPython Execution Model

CPython (the reference Python implementation) interprets bytecode. Every Python
object — an integer, a list element, a function — is a `PyObject*` struct on the
heap. Every operation — an addition, a list index, an attribute lookup — goes
through the interpreter loop, dispatching on opcode.

This indirection has a cost. A tight Python loop that adds integers is doing,
roughly:

1. Fetch the opcode
2. Dispatch to the handler
3. Dereference the left operand `PyObject*`
4. Dereference the right operand `PyObject*`
5. Call `PyNumber_Add()` — a function pointer dispatch
6. Allocate a new `PyObject*` for the result
7. Increment/decrement reference counts
8. Loop

For a single operation. Repeated millions of times, this overhead is not a
constant factor — it's the entire runtime profile.

C code calling C code is: load register, add, store register. The gap is 10–100×
depending on the operation.

## What a C Extension Actually Is

CPython exposes a stable C API (`Python.h`) that lets C code define
Python-callable functions, types, and modules. The extension is compiled to a
shared library (`.so` on Linux, `.pyd` on Windows) and imported like any Python
module.

```c
// fast_sum.c — a minimal C extension
#define PY_SSIZE_T_CLEAN
#include <Python.h>

static PyObject* fast_sum(PyObject* self, PyObject* args) {
    Py_buffer view;
    if (!PyArg_ParseTuple(args, "y*", &view)) return NULL;

    long long total = 0;
    const unsigned char* data = (const unsigned char*)view.buf;
    for (Py_ssize_t i = 0; i < view.len; i++) {
        total += data[i];
    }
    PyBuffer_Release(&view);
    return PyLong_FromLongLong(total);
}

static PyMethodDef FastMethods[] = {
    {"fast_sum", fast_sum, METH_VARARGS, "Sum bytes in a buffer"},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef fastmodule = {
    PyModuleDef_HEAD_INIT, "fast_sum", NULL, -1, FastMethods
};

PyMODINIT_FUNC PyInit_fast_sum(void) {
    return PyModule_Create(&fastmodule);
}
```

```python
# setup.py
from setuptools import setup, Extension

setup(
    ext_modules=[Extension("fast_sum", sources=["fast_sum.c"])]
)
```

```bash
python setup.py build_ext --inplace
python -c "import fast_sum; print(fast_sum.fast_sum(b'hello world'))"
```

The compiled extension is called from Python like any other function. Inside,
it's pure C — no interpreter overhead per element, no reference counting per
iteration.

## The GIL: Why C Extensions Release It

The Global Interpreter Lock (GIL) ensures only one thread executes Python
bytecode at a time. It's CPython's memory-model simplification — reference
counting without locks.

C extensions can **release the GIL** during compute-heavy or I/O-bound
operations, enabling true parallelism:

```c
// Release GIL during heavy computation
Py_BEGIN_ALLOW_THREADS
    // Pure C work — no Python objects touched here
    compute_fft(input_buffer, output_buffer, n);
Py_END_ALLOW_THREADS
```

NumPy does this. PyTorch does this. While Python's GIL blocks multi-threaded
Python code, the C core of these libraries runs in parallel across CPU cores.
This is why `numpy.dot` on large matrices saturates all cores despite Python's
threading limitations.

## The NumPy Architecture as a Case Study

NumPy's `ndarray` stores data as a raw C memory buffer — not as a list of
`PyObject*` items. A float64 array of 1 million elements is 8MB of contiguous
memory, laid out exactly as C would lay it out.

```
PyObject header (ob_refcnt, ob_type)
└─ ndarray struct
   ├─ data pointer → [8 bytes][8 bytes][8 bytes]...[8 bytes]  ← raw C doubles
   ├─ shape (C array of npy_intp)
   ├─ strides (C array of npy_intp)
   └─ dtype descriptor
```

When you call `a + b` on two ndarrays, NumPy dispatches to a C loop that:

1. Reads raw doubles from `a.data`
2. Reads raw doubles from `b.data`
3. Writes raw doubles to `out.data`
4. Returns a single `PyObject*` wrapping the result ndarray

The Python interpreter sees one object. The C layer processed a million
elements.

## Why Not Just Use PyPy or Numba?

Valid question. Here's the tradeoff landscape:

| Approach              | Best For                                    | Limitations                                                   |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| C extension (CPython) | Maximum control, FFI to existing C/C++ libs | Verbose, manual memory management, C expertise required       |
| Cython                | Annotated Python → C — good middle ground   | Build step, syntax diverges from Python                       |
| Numba (@jit)          | Numerical loops, array ops — JIT compiled   | Limited to numeric types, no arbitrary Python                 |
| PyPy                  | General Python speedup without code changes | Incompatible with many C extensions (NumPy workarounds exist) |
| ctypes / cffi         | Calling existing C libraries from Python    | No Python integration, manual type marshaling                 |
| Pybind11              | Modern C++ bindings — used by PyTorch       | C++ required, compilation overhead                            |

Most major libraries use C/C++ directly because they need maximum control over
memory layout, SIMD vectorization, and interop with BLAS/LAPACK or CUDA. Numba
and Cython are excellent tools but don't cover these use cases.

## BLAS, LAPACK, and the Linear Algebra Stack

NumPy and SciPy don't even implement their own linear algebra primitives. They
delegate to BLAS (Basic Linear Algebra Subprograms) and LAPACK — Fortran
libraries written in the 1970s–80s, hand-tuned for SIMD and cache locality over
decades.

```python
import numpy as np

# This call path:
a = np.random.rand(4096, 4096)
b = np.random.rand(4096, 4096)
c = a @ b  # 274 billion FLOPs/s on a modern CPU

# Resolves to:
# Python __matmul__ → NumPy C dispatcher → BLAS dgemm()
# dgemm is Fortran, auto-vectorized, cache-blocked, possibly OpenBLAS or MKL
```

Python's role in that call: zero compute. It dispatches and waits.

> [!TIP]
> When profiling Python code, check whether the time is in Python bytecode or
> inside a C extension. If `cProfile` shows most time in functions you didn't
> write (`numpy`, `pandas`, `torch`), you're already in C — further Python
> optimization won't help. The bottleneck is data volume and algorithm complexity.

## The Modern Continuation: nanobind and maturin

The toolchain for writing Python extensions is evolving. `pybind11` replaced raw
C API for C++ bindings. `nanobind` (from the pybind11 author) is its leaner
successor. `maturin` brings Rust into the same slot — the `cryptography` library
migrated its C core to Rust in 2021.

```toml
# Cargo.toml — Rust extension via PyO3 + maturin
[package]
name = "fast-parser"
version = "0.1.0"
edition = "2021"

[lib]
name = "fast_parser"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.22", features = ["extension-module"] }
```

```rust
// src/lib.rs
use pyo3::prelude::*;

#[pyfunction]
fn count_lines(text: &str) -> usize {
    text.bytes().filter(|&b| b == b'\n').count()
}

#[pymodule]
fn fast_parser(_py: Python<'_>, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(count_lines, m)?)?;
    Ok(())
}
```

The pattern is identical — Python interface, systems-language core. Rust adds
memory safety that C doesn't provide, without sacrificing the performance
characteristics.

## The Design Principle

Python's performance story isn't a weakness to apologize for. It's a deliberate
architecture: a high-productivity, dynamic interface language sitting above a
systems-language compute layer. The boundary between the two — the C extension
API — is stable, well-documented, and battle-tested across three decades.

When you `import numpy`, you're importing a C library with Python bindings. When
you `pip install cryptography`, you're getting Rust with a Python interface. The
Python you write is configuration and orchestration. The compute is native.

This is the right division of labor. Fighting it — rewriting NumPy in pure
Python for "simplicity" — is not engineering. It's ignoring the problem the
architecture already solved.
