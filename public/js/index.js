const postCollection = db.collection('post')

postCollection
	.orderBy('docId', 'desc')
	.get()
	.then((docs) => {
		docs.forEach((doc) => {
			console.log('doc : ', doc.data())
			const info = doc.data()
			const post = `
    <article>
        <div class="post-profile">
          <img src="" alt="프로필 이미지">
          <div class="user-name">사용자 이름</div>
        </div>
        <div class="post">
          <div class="category">${info.category}</div>
          <div class="title">${info.title}</div>
          <div class="hashtag">${info.hashtag}</div>
          <div class="description">${info.description}</div>
        </div>
        <div class="post-footer">
          <div class="post-like">
            <i class="fa-solid fa-heart"></i>
            <span>${info.like}</span>
          </div>
          <div class="post-comment">
            <i class="fa-solid fa-comment"></i>
            <span>${info.comment}</span>
          </div>
        </div>
      </article>
    `
			const section = document.querySelector('section')
			section.innerHTML += post
		})
	})
