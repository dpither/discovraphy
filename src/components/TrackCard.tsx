interface TrackCardProps {
  key: number;
  img: string;
  name: string;
  artist: string;
  album: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function TrackCard({
  key,
  img,
  name,
  artist,
  album,
  isSelected,
  onClick,
}: TrackCardProps) {
  return (
    <div
      key={key}
      className={` ${isSelected ? "border-black dark:border-white" : "border-transparent"} group flex flex-col rounded border-2 p-2 text-sm text-black duration-200 hover:border-black dark:text-white hover:dark:border-white`}
      onClick={onClick}
    >
      <img
        className="aspect-square w-full rounded object-cover duration-200 group-hover:scale-105"
        src={img}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-1">{name}</p>
        <p className="line-clamp-1">{artist}</p>
        <p className="line-clamp-1">{album}</p>
      </div>
    </div>
  );
}
