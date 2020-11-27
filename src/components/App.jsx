/*
Author: chankruze (chankruze@geekofia.in)
Created: Tue Nov 24 2020 07:04:05 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

import React, { useState } from 'react';
import axios from 'axios';
import styles from './App.module.sass';

const handleDl = (torrentUrl) => {
	// post req
	const data = JSON.stringify({ torrentUrl });

	const config = {
		method: 'post',
		url: 'http://localhost:3265/file/download',
		headers: {
			'x-cproxy-api-key': 'V1StGXR8_Z5jdHi6B-myT',
			'Content-Type': 'application/json'
		},
		data: data
	};

	axios(config)
		.then(({ data: { status, file } }) => {
			if (status === 'ok') {
				axios
					.get(`http://localhost:3265/file/download`, {
						params: { fileName: file },
						headers: {
							'x-cproxy-api-key': 'V1StGXR8_Z5jdHi6B-myT'
						},
						responseType: 'blob'
					})
					.then(({ data }) => {
						const url = window.URL.createObjectURL(
							new Blob([data], {
								type: 'application/x-bittorrent'
							})
						);
						const link = document.createElement('a');
						link.href = url;
						link.setAttribute('download', file);
						document.body.appendChild(link);
						link.click();

						axios
							.post(
								`http://localhost:3265/file/delete`,
								{
									fileName: file
								},
								{
									headers: {
										'x-cproxy-api-key':
											'V1StGXR8_Z5jdHi6B-myT',
										'Content-Type': 'application/json'
									}
								}
							)
							.then(({ data }) => console.log(data))
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((error) => {
			console.log(error);
		});

	// get data

	// save to device
};

const App = () => {
	const [torrentUrl, setTorrentUrl] = useState('');

	return (
		<div className={styles.app}>
			<p>
				https://yts.mx/torrent/download/5E8BC430960F5E1F48B0ACC2FCB607AB192D612E
			</p>
			<div>
				<p>Torrent URL</p>
				<input
					type="text"
					value={torrentUrl}
					onChange={(e) => setTorrentUrl(e.target.value)}
				/>
			</div>
			<button onClick={() => handleDl(torrentUrl)}>Download</button>
		</div>
	);
};

export default App;
