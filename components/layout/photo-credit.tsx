const CREDIT_URL = "https://commons.wikimedia.org/w/index.php?curid=36291989";

export function PhotoCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[10px] leading-snug ${className}`}>
      מאת AVRAM GRAICER - נוצר על־ידי מעלה היצירה,{" "}
      <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.he" className="underline" target="_blank" rel="license noreferrer">
        CC BY-SA 3.0
      </a>
      ,{" "}
      <a href={CREDIT_URL} className="underline" target="_blank" rel="noreferrer">
        {CREDIT_URL}
      </a>
    </p>
  );
}
