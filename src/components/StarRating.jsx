import { C } from "./colors";

export default function StarRating({ rating, max = 5, size = 16 }) {
  return (
    <span role="img" aria-label={`Rating: ${rating} out of ${max}`} style={{ fontSize: size }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} aria-hidden="true" style={{ color: i < rating ? C.secondary : C.border }}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
