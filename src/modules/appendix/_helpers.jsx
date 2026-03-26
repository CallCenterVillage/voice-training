import { SectionDivider } from '../../components';

export { SectionDivider };

export const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
