exports.multiLangString = (reqText, ruDefaultText, uzDefaultText) => {
	return {
		ru: {
			type: String,
			requried: [true, `${reqText}! (ru)`],
			default: ruDefaultText,
		},
		uz: {
			type: String,
			requried: [true, `${reqText}! (uz)`],
			default: uzDefaultText,
		},
	};
};

exports.img = (defaultPath) => {
	return {
		type: String,
		requried: [true, 'Загрузите изображение!'],
		default: defaultPath,
	};
};
