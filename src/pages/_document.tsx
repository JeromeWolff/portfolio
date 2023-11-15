import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document';
import i18nextConfig from '../../next-i18next.config';

interface CustomDocumentProps extends DocumentInitialProps {
  currentLocale?: string;
}

class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    const currentLocale = context.query.locale || i18nextConfig.i18n.defaultLocale;
    return {...initialProps, currentLocale};
  }

  render() {
    return (
      <Html lang={this.props.currentLocale}>
        <Head/>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
