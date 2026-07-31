type HabitCardProps = {
  title: string;
  streak: number;
  done: boolean;
  onToggle: () => void;
};

export default function HabitCard({ title, streak, done, onToggle }: HabitCardProps) {
  return (
    <div
      className="group bg-card rounded-2xl p-5 flex items-center justify-between
      shadow-md hover:shadow-xl hover:shadow-accent/30
      hover:-translate-y-1 transition-all duration-300 ease-out
      border border-transparent hover:border-accent/50"
    >
      <div>
        <h3 className="text-cream text-lg font-skranji tracking-wide">
          {title}
        </h3>
        <p className="text-accent text-sm mt-1 group-hover:text-cream/70 transition-colors duration-300">
          🔥 {streak} днів поспіль
        </p>
      </div>

      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
        transition-all duration-300 active:scale-90
        ${
          done
            ? "bg-accent border-accent scale-105"
            : "border-accent hover:bg-accent/20"
        }`}
      >
        {done && <span className="text-cream animate-[pop_0.3s_ease]">✓</span>}
      </button>
    </div>
  );
}