import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useImperativeHandle } from "react";
import Slider from "../../components/Slider";
import type { SwipeDirection } from "../../hooks/usePlayerStore";
import { formatTimeMs } from "../../lib/util";

export type DummyTrack = {
	name: string;
	artists: string;
	image: string;
	currentTimeMs: number;
	durationMs: number;
};

export type DummyTrackHandle = {
	playSwipe: (direction: SwipeDirection) => Promise<void>;
};

interface DummyTrackCardProps {
	onDragEnd?: () => void;
	onDragStart?: () => void;
	onSwipe?: () => void;
	position: string;
	ref?: React.Ref<DummyTrackHandle>;
	track: DummyTrack;
}

const X_BOUND = 125;

export default function TrackCard({
	onDragEnd: onDragEndCallback,
	onDragStart,
	onSwipe,
	position,
	ref,
	track,
}: DummyTrackCardProps) {
	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-X_BOUND, X_BOUND], [-11.25, 11.25]);
	const opacity = useTransform(x, [-X_BOUND, 0, X_BOUND], [0, 1, 0]);

	useImperativeHandle(ref, () => {
		return {
			async playSwipe(direction: SwipeDirection) {
				const targetX = direction === "LEFT" ? -X_BOUND : X_BOUND;
				if (scope.current) {
					await animate(
						scope.current,
						{ x: targetX, scale: 1.05 },
						{ duration: 0.5, ease: "easeInOut", bounce: 0 },
					);
				}
				onSwipe?.();
			},
		};
	}, [animate, onSwipe, scope.current]);
	return (
		<motion.div
			className="z-10 flex origin-bottom select-none flex-col gap-2 rounded-sm border border-black bg-white p-4 hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white dark:bg-black"
			drag="x"
			dragElastic={0}
			dragMomentum={false}
			onDragEnd={(_event, info) => {
				const offset = info.offset.x;
				// const velocity = info.velocity.x; TUNE LATER MAYBE?

				if (offset >= X_BOUND) {
					onSwipe?.();
				} else if (offset <= -X_BOUND) {
					onSwipe?.();
				}
				animate(
					scope.current,
					{ x: 0 },
					{ duration: 0.3, ease: "easeInOut", bounce: 0 },
				);
				onDragEndCallback?.();
			}}
			onDragStart={onDragStart}
			ref={scope}
			style={{
				x,
				rotate,
				opacity,
			}}
			whileDrag={{ scale: 1.05 }}
		>
			{/* Header */}
			<div className="flex items-center justify-end">
				<p className="sub-text text-xs">{position}</p>
			</div>
			{/* Track Art */}
			<div className="w-42 text-white md:w-64 dark:text-black">
				<img
					alt="Track artwork"
					className="aspect-square size-full rounded-sm object-cover lg:rounded-lg"
					draggable={false}
					src={track.image}
				/>
			</div>
			{/* Info */}
			<div className="flex w-full flex-col text-left">
				<p className="line-clamp-1 font-semibold">{track.name}</p>
				<p className="sub-text line-clamp-1 text-sm">{track.artists}</p>
			</div>
			{/* Progress Bar */}
			<div className="flex w-full flex-col">
				<Slider
					maxValue={track.durationMs}
					onValueChange={() => {}}
					onValueChangeFinished={() => {}}
					value={track.currentTimeMs}
				/>
				<div className="flex justify-between">
					<p className="sub-text text-xs">
						{formatTimeMs(track.currentTimeMs)}
					</p>
					<p className="sub-text text-xs">{formatTimeMs(track.durationMs)}</p>
				</div>
			</div>
		</motion.div>
	);
}
