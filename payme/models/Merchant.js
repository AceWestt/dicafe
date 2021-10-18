class Merchant {
	constructor(config) {
		this.config = config;
	}
	authorize(headers) {
		if (headers && headers['Authorization']) {
			const matches = headers['Authorization'].match(/^\s*Basic\s+(\S+)\s*$/i);
			if (matches) {
				const decoded = Buffer.from(matches[1], 'base64').toString('utf-8');
				console.log(decoded);
				if (decoded === `${this.config['login']}:${this.config['key']}`) {
					return true;
				}
				return false;
			}

			return false;
		}
		return false;
	}
}

module.exports = Merchant;
