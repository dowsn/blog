import appRoot from 'app-root-path';
import path from 'path';
import { fileURLToPath } from 'url';

let constants = {};

constants.__filename = fileURLToPath(import.meta.url);
constants.__dirname = path.dirname(constants.__filename);


constants.rootPath = appRoot.path;

export default constants;