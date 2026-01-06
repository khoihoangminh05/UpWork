import React from "react";
import { Star } from "lucide-react";
import vector200 from "../../assets/vector.svg";
export const TrustedReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "", 
      rating: 5,
      review:
        "Great service! The cleaner was punctual and did a fantastic job.",
    },
    {
      id: 2,
      name: "Bob Nguyen",
      avatar: "",
      rating: 4,
      review: "Highly recommend the plumbing services. Very professional!",
    },
    {
      id: 3,
      name: "Trang Le",
      avatar: "",
      rating: 5,
      review:
        "Very friendly provider and quick response. Will use again for sure.",
    },
  ];

  const renderStars = (n) => {
    const stars = Array.from({ length: 5 }).map((_, i) => {
      const filled = i < n;
      return (
        <Star
          key={i}
          className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
          aria-hidden="true"
        />
      );
    });
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="flex flex-col items-center gap-8 px-6 md:px-12 lg:px-28 py-16 relative w-full overflow-hidden">
      <header className="w-full max-w-6xl">
        <h2 className="font-bold text-black text-[36px] md:text-[40px] leading-[44px] text-center">
          Trusted Reviews
        </h2>
        <p className="text-gray-700 mt-2 text-center">
          See what our customers have to say.
        </p>
      </header>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-white border border-[#00000012] rounded-lg p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {r.avatar ? (
                    <img
                      src={r.avatar}
                      alt={`${r.name} avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium">
                      <span className="text-sm">{initials(r.name)}</span>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-black leading-5">
                      {r.name}
                    </h3>
                    <div className="text-xs text-gray-500">{/* optional date */}</div>
                  </div>
                </div>

                {/* Stars */}
                <div aria-hidden="false" aria-label={`${r.rating} out of 5 stars`}>
                  {renderStars(r.rating)}
                </div>
              </div>

              <p
                className="text-sm text-gray-700 leading-6 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {r.review}
              </p>
            </article>
          ))}
        </div>
      </div>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={vector200}
        role="presentation"
      />
    </section>
  );
};
