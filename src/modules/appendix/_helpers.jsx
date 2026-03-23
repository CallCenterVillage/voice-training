import { C } from '../../components';

export const SectionDivider = () => <hr style={{ border: "none", borderTop: "1px solid #040208", margin: "48px 0" }} />;

export const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
