// Warm animated gradient border container
function BorderAnimatedContainer({ children }) {
  return (
    <div
      className="w-full h-full rounded-none border border-transparent flex overflow-hidden animate-border"
      style={{
        background: `
          linear-gradient(135deg, #fff9f4, #fef3e8 50%, #fffbf7) padding-box,
          conic-gradient(
            from var(--border-angle),
            #f97316 0%,
            #fbbf24 20%,
            #fb923c 40%,
            #fcd34d 55%,
            #f97316 70%,
            #ef4444 85%,
            #f97316 100%
          ) border-box
        `,
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "transparent",
      }}
    >
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;


