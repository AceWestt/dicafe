const DoodleScreen = require('../models/DoodleScreen');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.doodlescreen = async (req, res, next) => {
	try {
		let screen = await DoodleScreen.findOne({ id: 777 });
		if (!screen) {
			screen = await new DoodleScreen({ id: 777 });
			await screen.save((err) => {
				if (err)
					return next(
						new ErrorResponse('Could not create doodlescreen assets', 500)
					);
			});
		}
		res.status(200).json({ data: screen });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const screen = await DoodleScreen.findById(id);
		screen.title = JSON.parse(body.title);
		screen.back_button = JSON.parse(body.back_button);
		screen.upload_button_text = JSON.parse(body.upload_button_text);

		const uploadpath = '/uploads/pages/doodles/';

		if (files?.upload_button_icn) {
			screen.upload_button_icn = await fileUpload(
				files.upload_button_icn,
				screen.upload_button_icn,
				'/uploads/pages/doodles/default/upload-icon.svg',
				next,
				'upload-button-icn_img',
				uploadpath
			);
		}

		if (files?.doodles_img) {
			screen.doodles_img = await fileUpload(
				files.doodles_img,
				screen.doodles_img,
				'/uploads/pages/doodles/default/doodles-demo.png',
				next,
				'doodles-img_img',
				uploadpath
			);
		}

		if (files?.doodles_img_mobile) {
			screen.doodles_img_mobile = await fileUpload(
				files.doodles_img_mobile,
				screen.doodles_img_mobile,
				'/uploads/pages/doodles/default/doodles-mobile.png',
				next,
				'doodles-img-mobile_img',
				uploadpath
			);
		}

		await screen.save((err) => {
			if (err) {
				return next(new ErrorResponse('something went wrong on save'));
			}
		});

		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const fileUpload = async (
	file,
	currentFile,
	defaultFile,
	next,
	mainName,
	movePath
) => {
	const new_img = file;
	const old_img = currentFile;
	if (old_img !== defaultFile) {
		try {
			if (
				await ifFileExists(
					`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`
				)
			) {
				fs.unlink(`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}
	}
	let ext = new_img.name.split('.');
	ext = ext[ext.length - 1];
	const file_name = `${crypto
		.randomBytes(10)
		.toString('hex')}-${mainName}-${new Date().getTime().toString()}.${ext}`;
	new_img.mv(`${__clientdir}${movePath}${file_name}`, (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(err, 500));
		}
	});

	return `${__uploadRoot}${movePath}${file_name}`;
};

const ifFileExists = async (path) => {
	try {
		await fs.access(path);
		return true;
	} catch (error) {
		return false;
	}
};
