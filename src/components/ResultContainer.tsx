import SpotifyLogo from "../assets/spotify_logo.svg?react";

interface ResultContainerProps {
	children?: React.ReactNode;
}

export default function ResultContainer({ children }: ResultContainerProps) {
	return (
		<div className="flex size-full min-h-0 flex-1 flex-col items-center justify-center gap-2">
			<SpotifyLogo className="w-20" />
			<div className="no-scrollbar grid size-full grid-cols-2 gap-2 overflow-y-auto pb-4 outline-blue outline-offset-2 focus-visible:outline-2 sm:grid-cols-4 xl:grid-cols-5">
				{children}
			</div>
		</div>
	);
}
