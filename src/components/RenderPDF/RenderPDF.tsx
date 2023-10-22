type Props = {
  url: string;
};

const RenderPDF = (props: Props) => {
  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex items-center gap-1.5">Top Bar</div>
      </div>
    </div>
  );
};

export default RenderPDF;
