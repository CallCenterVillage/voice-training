import { C } from "./colors";

export default function StarRating({ rating, max = 5, size = 16 }) {
  return (
    <span style={{ fontSize: size }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? C.secondary : C.border }}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
