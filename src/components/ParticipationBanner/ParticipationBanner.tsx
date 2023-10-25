const ParticipationBanner = () => {
  return (
    <div className="hidden h-14 w-full items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600 md:flex">
      <h3 className="font-bold text-white selection:bg-red-300">
        PDFwhisper is taking part in Hanko Hackathon 🎉 Consider giving us a
        <a
          href="https://github.com/shricodev/pdfwhisper-openai"
          rel="noopener"
          target="_blank"
          className="text-orange-200"
        >
          {" "}
          star
        </a>{" "}
        🌟
      </h3>
    </div>
  );
};

export default ParticipationBanner;
