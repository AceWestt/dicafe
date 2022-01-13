const ContactScreen = require('../models/ContactScreen');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.contactscreen = async (req, res, next) => {
	try {
		let screen = await ContactScreen.findOne({ id: 777 });
		if (!screen) {
			screen = await new ContactScreen({ id: 777 });
			await screen.save((err) => {
				if (err)
					return next(
						new ErrorResponse('Could not create contactscreen assets', 500)
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

		const screen = await ContactScreen.findById(id);
		screen.title = JSON.parse(body.title);
		screen.back_button = JSON.parse(body.back_button);
		screen.address = JSON.parse(body.address);
		screen.phone = body.phone;

		const uploadpath = '/uploads/pages/contact/';

		if (files?.address_icn) {
			screen.address_icn = await fileUpload(
				files.address_icn,
				screen.address_icn,
				'/uploads/pages/contact/default/icn-map.svg',
				next,
				'address-icn_img',
				uploadpath
			);
		}

		if (files?.address_icn_mobile) {
			screen.address_icn_mobile = await fileUpload(
				files.address_icn_mobile,
				screen.address_icn_mobile,
				'/uploads/pages/contact/default/icn-map-mobile.svg',
				next,
				'address-icn-mobile_img',
				uploadpath
			);
		}

		if (files?.phone_icn) {
			screen.phone_icn = await fileUpload(
				files.phone_icn,
				screen.phone_icn,
				'/uploads/pages/contact/default/phone-mobile.svg',
				next,
				'phone-icn-mobile_img',
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
