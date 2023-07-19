/* Markdown Parser := react + react-markdown */
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Readme from '../../README.md';

function MarkdownToHtml(){
  return(
    <ReactMarkdown remarkPlugins={[gfm]}>{`${Readme}`}</ReactMarkdown>
  )
}
export default MarkdownToHtml;
