export const calculateAge = (birthdate: string): number => {
  const birthDate = new Date(birthdate).getTime();
  const ageDifMs = Date.now() - birthDate;
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
