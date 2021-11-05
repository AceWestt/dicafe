import React from 'react';
import bg from './imgs/dayOffmodal/day-off-modal-bg.svg';
import bgMobile from './imgs/dayOffmodal/day-off-modal-bg-mobile.svg';
import closeBtn from './imgs/dayOffmodal/day-off-modal-close-btn.svg';
import confirmBtn from './imgs/dayOffmodal/day-off-modal-confirm-btn-bg.svg';
import { useAppContext } from '../context';

const DayOffModal = ({
	className = '',
	title = 'Упс!',
	text: Text,
	btnText = 'Окей',
	onConfirm = () => {},
	onClose = () => {},
}) => {
	const { smallScreen } = useAppContext();
	return (
		<div className={`modal modal-wrapper ${className}`}>
			<div className="modal-container">
				<img src={smallScreen ? bgMobile : bg} className="bg" alt="bg" />
				<div className="content">
					<div className="header">
						<span>{title}</span>
						<img className="close-btn" src={closeBtn} alt="close" onClick={onClose} />
					</div>
					<p>
						<Text />
					</p>
					<div className="confirm-btn" onClick={onConfirm}>
						<img src={confirmBtn} alt="okey" />
						<span>{btnText}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayOffModal;
