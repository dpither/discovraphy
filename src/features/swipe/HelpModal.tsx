import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import CloseIcon from "../../assets/close_icon.svg?react";
import HelpIcon from "../../assets/help_icon.svg?react";
import FlatButton from "../../components/FlatButton";
import Tooltip from "../../components/Tooltip";
import { useSetupStore } from "../../hooks/useSetupStore";

export default function HelpModal() {
	const [isOpen, setIsOpen] = useState(false);
	const { selectedDestination } = useSetupStore();

	const toggleModal = () => setIsOpen((prev) => !prev);

	useEffect(() => {
		function blockKeys(e: KeyboardEvent) {
			e.stopImmediatePropagation();
			e.preventDefault();
		}
		if (isOpen) {
			document.addEventListener("keydown", blockKeys, { capture: true });
		} else {
			document.removeEventListener("keydown", blockKeys, { capture: true });
		}
		return () => {
			document.removeEventListener("keydown", blockKeys, { capture: true });
		};
	}, [isOpen]);

	return (
		<div>
			<Tooltip position="TOP" text="Help">
				<FlatButton onClick={toggleModal}>
					<HelpIcon className="flat-icon" />
				</FlatButton>
			</Tooltip>
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 flex items-center justify-center">
						{/* BACKGROUND */}
						<button
							className="fixed inset-0"
							onClick={() => setIsOpen(false)}
							type="button"
						></button>
						{/* MODAL */}
						<motion.div
							animate={{ opacity: 1 }}
							className="relative flex w-80 flex-col gap-4 rounded-sm border-1 border-black bg-white p-4 text-left lg:rounded-lg dark:border-white dark:bg-black"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onKeyUp={(e) => e.stopPropagation()}
							tabIndex={-1}
							transition={{ duration: 0.15, ease: "easeInOut", bounce: 0 }}
						>
							<div className="absolute top-2 right-2">
								<Tooltip position="TOP" text="Close">
									<FlatButton onClick={toggleModal}>
										<CloseIcon className="flat-icon" />
									</FlatButton>
								</Tooltip>
							</div>
							<div className="flex flex-col gap-2">
								<h2>General Info</h2>
								{/* CHANGE DESC TO INCLUDE DESTINATION? */}
								<p>
									<span className="font-semibold"> LIKE</span> to add the song
									to
									{selectedDestination === "SAVE"
										? " your saved tracks "
										: " your selected playlist "}
									by swiping
									<span className="font-semibold"> RIGHT</span>.
								</p>
								<p>
									<span className="font-semibold"> DISLIKE</span> to remove the
									song from{" "}
									{selectedDestination === "SAVE"
										? " your saved tracks "
										: " your selected playlist "}{" "}
									by swiping
									<span className="font-semibold"> LEFT</span>.
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Keyboard Controls</h2>
								<div className="grid grid-cols-2">
									<p>Like</p>
									<p className="text-right">D / Right Arrow</p>
									<p>Dislike</p>
									<p className="text-right">A / Left Arrow</p>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
