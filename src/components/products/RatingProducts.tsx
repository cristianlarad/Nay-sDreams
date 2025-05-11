interface StarProps {
  fillPercentage: number;
}
const Star = ({ fillPercentage }: StarProps) => {
  const widthPercent = Math.max(0, Math.min(100, fillPercentage * 100));
  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        width: "24px",
        height: "24px",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <path
          d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
          fill="lightgray"
        />
      </svg>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          clipPath: `inset(0 ${100 - widthPercent}% 0 0)`,
        }}
      >
        <path
          d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
          fill="gold"
        />
      </svg>
    </span>
  );
};

interface RatingProductsProps {
  rating: number;
}

const RatingProducts = ({ rating }: RatingProductsProps) => {
  const totalStars = 5;

  return (
    <div>
      {Array.from({ length: totalStars }, (_, index) => {
        const starRatingValue = rating - index; // Ej: rating 3.7, index 0 -> 3.7; index 1 -> 2.7; index 3 -> 0.7; index 4 -> -0.3
        let fillPercentage = 0;

        if (starRatingValue >= 1) {
          fillPercentage = 1; // Estrella completamente llena
        } else if (starRatingValue > 0) {
          fillPercentage = starRatingValue; // Estrella parcialmente llena
        }

        return <Star key={index} fillPercentage={fillPercentage} />;
      })}
    </div>
  );
};

export default RatingProducts;
