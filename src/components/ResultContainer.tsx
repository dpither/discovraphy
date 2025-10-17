interface ResultContainerProps {
	children?: React.ReactNode;
}

export default function ResultContainer({ children }: ResultContainerProps) {
	return (
		<div className="no-scrollbar grid size-full grid-cols-2 gap-2 overflow-y-auto p-4 outline-blue outline-offset-2 focus-visible:outline-2 sm:grid-cols-4 2xl:grid-cols-5">
			{children}
		</div>
	);
}
