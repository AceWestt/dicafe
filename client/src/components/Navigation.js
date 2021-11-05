import React from 'react';
import soundIcnMobile from './imgs/soundIcn-mobile.svg';
import soundIcnMobileOff from './imgs/soundIcn-mobile-off.svg';
import checkoutIcnMobile from './imgs/checkoutIcn-mobile.svg';
import { useAppContext } from '../context';
import { useSceneChangeContext } from '../sceneChangeContext';
import { useAxiosGet } from '../hooks/useAxiosGet';

const NavTop = () => {
	const { data } = useAxiosGet('/api/general');

	const { smallScreen, isMusicOn, setIsMusicOn, lang, setIsCartOpen } =
		useAppContext();
	const { cartRef } = useSceneChangeContext();
	if (smallScreen) {
		return (
			<div className="nav top only-mobile">
				<div className="left">
					{/* <LangSwitch data={data} /> */}
					<NavButton
						className="music"
						icn={isMusicOn ? soundIcnMobile : soundIcnMobileOff}
						onClick={() => setIsMusicOn(!isMusicOn)}
					/>
				</div>
				<div className="right">
					<NavButton
						className="cart"
						icn={checkoutIcnMobile}
						onClick={() => setIsCartOpen(true)}
					/>
				</div>
			</div>
		);
	}
	return (
		<div className="nav top">
			<NavButton
				className="checkout"
				icn={data?.checkout_icn}
				text={data?.checkout_text[lang]}
				navButtonRef={cartRef}
				onClick={() => setIsCartOpen(true)}
			/>
		</div>
	);
};

const NavBottom = () => {
	const { smallScreen, isMusicOn, setIsMusicOn, lang } = useAppContext();
	const { isCopyOn } = useSceneChangeContext();
	const { data } = useAxiosGet('/api/general');
	if (smallScreen) {
		return (
			<div className="nav bottom">
				{isCopyOn && <div className="nav-button copy">{data?.copy[lang]}</div>}
			</div>
		);
	}
	return (
		<div className="nav bottom">
			<NavButton
				className="sound"
				icn={data?.music_toggle_icn}
				text={
					isMusicOn
						? data?.music_toggle_text?.on[lang]
						: data?.music_toggle_text?.off[lang]
				}
				onClick={() => setIsMusicOn(!isMusicOn)}
			/>
			{isCopyOn && <div className="nav-button copy">{data?.copy[lang]}</div>}

			<NavButton className="phone" icn={data?.phone_icn} text={data?.phone} />
			{/* <LangSwitch data={data} /> */}
		</div>
	);
};

const NavButton = ({ icn, text, className, onClick, navButtonRef }) => {
	const { cartList } = useAppContext();
	return (
		<div
			className={className ? `nav-button ${className}` : 'nav-button'}
			onClick={onClick}
			ref={navButtonRef}
		>
			<img src={icn} className="icn" alt="icn" />
			{text && <span>{text} </span>}
			{cartList.length > 0 && className === 'checkout' && (
				<div className="alert" />
			)}
			{cartList.length > 0 && className === 'cart' && <div className="alert" />}
		</div>
	);
};

// const LangSwitch = ({ data }) => {
// 	const { lang, setLang } = useAppContext();
// 	return (
// 		<div className="nav-button lang-switch">
// 			<span
// 				className={lang === 'ru' ? 'active' : undefined}
// 				onClick={() => setLang('ru')}
// 			>
// 				{data?.lang_switch?.ru}
// 			</span>
// 			<span
// 				className={lang === 'uz' ? 'active' : undefined}
// 				onClick={() => setLang('uz')}
// 			>
// 				{data?.lang_switch?.uz}
// 			</span>
// 		</div>
// 	);
// };

export { NavTop, NavBottom };
