import { Link } from "react-router";
import Button from "../../components/Button";

export default function SwipeResults() {
	return (
		<div className="flex rounded-sm border-1 border-black p-4 lg:rounded-lg dark:border-white">
			<div className="flex w-64 flex-col gap-2 text-left">
				<h2>Expedition Complete</h2>
				<p>You discovered 67 tracks</p>
				<p>d</p>
				<div className="text-center">
					<Link to={`/setup`}>
						<Button text="Keep Exploring"></Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
