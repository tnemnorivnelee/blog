const category = document.querySelector('#category-select')
const public = document.querySelector('#open-select')
const title = document.querySelector('#title')
// const description = document.querySelector('#editor')
const hashtag = document.querySelector('#hashtag')

const uploadBtn = document.querySelector('#uploadBtn')

let editor

ClassicEditor.create(document.querySelector('#editor'), {
	extraPlugins: [MyCustomUploadAdapterPlugin],
	language: 'ko',
	// ...
})
	.then((newEditor) => {
		editor = newEditor
	})
	.catch((error) => {
		console.error(error)
	})

class MyUploadAdapter {
	constructor(loader) {
		// CKEditor 5's FileLoader instance.
		this.loader = loader

		// URL where to send files.
		// this.url = 'https://example.com/image/upload/path'
	}

	// Starts the upload process.
	// upload() {
	// 	return new Promise((resolve, reject) => {
	// 		this._initRequest()
	// 		this._initListeners(resolve, reject)
	// 		this._sendRequest()
	// 	})
	// }
	upload() {
		return this.loader.file.then((file) => {
			new Promise((resolve, reject) => {
				const storage = firebase.storage().ref()
				const uploadTask = storage.child(file.name).put(file)
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						console.log('Uploading...')
					},
					(err) => {
						console.log('!!Uploading Error!! => ', err)
					},
					() => {
						console.log('Upload Success!!')
						uploadTask.snapshot.ref.getDownloadURL().then((url) => {
							resolve({
								default: url,
							})
						})
					}
				)
			})
		})
	}

	// // Aborts the upload process.
	// abort() {
	// 	if (this.xhr) {
	// 		this.xhr.abort()
	// 	}
	// }

	// // Example implementation using XMLHttpRequest.
	// _initRequest() {
	// 	const xhr = (this.xhr = new XMLHttpRequest())

	// 	xhr.open('POST', this.url, true)
	// 	xhr.responseType = 'json'
	// }

	// // Initializes XMLHttpRequest listeners.
	// _initListeners(resolve, reject) {
	// 	const xhr = this.xhr
	// 	const loader = this.loader
	// 	const genericErrorText = "Couldn't upload file:" + ` ${loader.file.name}.`

	// 	xhr.addEventListener('error', () => reject(genericErrorText))
	// 	xhr.addEventListener('abort', () => reject())
	// 	xhr.addEventListener('load', () => {
	// 		const response = xhr.response

	// 		if (!response || response.error) {
	// 			return reject(response && response.error ? response.error.message : genericErrorText)
	// 		}

	// 		// If the upload is successful, resolve the upload promise with an object containing
	// 		// at least the "default" URL, pointing to the image on the server.
	// 		resolve({
	// 			default: response.url,
	// 		})
	// 	})

	// 	if (xhr.upload) {
	// 		xhr.upload.addEventListener('progress', (evt) => {
	// 			if (evt.lengthComputable) {
	// 				loader.uploadTotal = evt.total
	// 				loader.uploaded = evt.loaded
	// 			}
	// 		})
	// 	}
	// }

	// Prepares the data and sends the request.
	// _sendRequest() {
	// 	const data = new FormData()

	// 	data.append('upload', this.loader.file)

	// 	this.xhr.send(data)
	// }
}

function MyCustomUploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		return new MyUploadAdapter(loader)
	}
}

uploadBtn.addEventListener('click', async (event) => {
	event.preventDefault()
	console.log('click upload btn')

	if (category.value == '카테고리 선택') {
		return alert('카테고리 선택')
	} else if (!title.value) {
		return alert('제목 작성')
	}

	// Firestore 에 저장할 내용
	const docId = Date.now().toString()

	// const desc = description.value

	// const urlStart = desc.indexOf('src="') + 5
	// const urlEnd = desc.indexOf('media', urlStart) + 5
	// const firstImage = desc.substring(urlStart, urlEnd)

	const uploadObj = {
		// time: new Date(),
		// year: new Date().getFullYear() + '년',
		// month: new Date().getMonth() + 1 + '월',
		// date: new Date().getDate() + '일',
		// time: new Date().toLocaleTimeString(),
		category: category.value,
		open: public.value,
		title: title.value,
		description: editor.getData(),
		hashtag: hashtag.value.split(' '),
		docId: docId,
		like: 0,
		comment: 0,
	}
	try {
		// console.log(typeof (time))
		console.log(uploadObj)
		await firebase
			.firestore()
			.collection('post')
			.doc(docId)
			.set(uploadObj)
			.then(() => {
				window.location.href = './'
			})
		// console.log(uploadObj)
		// console.log('Upload Content Success')
	} catch (error) {
		console.log('Upload Content Error => ', error)
	}
})
