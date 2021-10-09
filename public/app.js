const likesElement = document.querySelector('.likes')
const barkContainer = document.querySelector('#barks')
// fetch('/barks/615fb978b30da97f2d6a7245/true')
//     .then(res => res.json())
//     .then(data => console.log(data))
var HTML = ``

const didUserLike = (bark) => {
    if(bark.userHasLiked) {
        return "has-text-danger"
    }
    return "has-text-primary"
}

fetch('/barks')
    .then(res => res.json())
    .then((data) => {
        data.reverse()
        data.forEach((bark) => {
            console.log(bark)
            HTML = `
            <div class="box">
            <article class="media">
            <div class="media-content">
                <div class="content">
                <p>
                    <strong>${bark.name}</strong>
                    <br>
                    ${bark.bark}
                </p>
                </div>
                <nav class="level is-mobile">
                <div class="level-left">
                    <a class="level-item bark" aria-label="like" data-id="${bark._id}">
                    <span class="icon is-small ${didUserLike(bark)}">
                        <i class="fas fa-heart" aria-hidden="true"></i>
                    </span>
                    <p class="likes ml-3 has-text-black">${bark.numOfLikes}</p>
                    </a>
                </div>
                </nav>
            </div>
            </article>
            </div>
            `

            barkContainer.innerHTML = barkContainer.innerHTML + HTML
        })
        return data
    })
    .then((data) => {
        const likeButton = document.querySelectorAll('.bark')
        likeButton.forEach((button) => {
            button.addEventListener('click', () => {
                const data = {"barkID": button.dataset.id}
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
                fetch('/barks/like', options)
                    .then(res => res.json())
                    .then((data) => {
                        console.log(data)
                        if(data.msg === 'added') {
                            button.childNodes[3].textContent = parseInt(button.childNodes[3].textContent, 10) + 1
                            button.childNodes[1].className = "icon is-small has-text-danger"
                        } else {
                            button.childNodes[3].textContent = parseInt(button.childNodes[3].textContent, 10) - 1
                            button.childNodes[1].className = "icon is-small has-text-primary"
                        }
                    })
            })
        })
    })