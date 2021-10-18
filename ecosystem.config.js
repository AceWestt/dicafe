module.exports = {
	apps: [
		{
			name: 'dicafe',
			script: './server.js',
			watch: true,
			env_production: {
				JWT_SECRET:
					'be6f4f02b627e93e93de964c2785fafa803979e0e2870c724c50f14c8f4725a375e904',
				JWT_EXPIRE: '2d',
				PAYME_TEST_KEY: 'pKd0EEwhF4IaxWKX@41OJpOYQC8J%cAzgTO#',
				PAYME_KEY: 'hRgAx4PfH6dzYQrji3PSnT1RhIkCyheRD&ap',
			},
		},
	],
};
