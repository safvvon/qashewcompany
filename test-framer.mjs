import { motionValue } from "framer-motion";
const mv = motionValue(0);
const res = mv.onChange(() => {});
const res2 = mv.on("change", () => {});
console.log("onChange returns:", typeof res);
console.log("on returns:", typeof res2);
