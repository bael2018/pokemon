const base = 'https://pokeapi.co/api/v2/pokemon/';

window.addEventListener('load' , () => {
    const lem = new XMLHttpRequest()
    lem.open('GET' , `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1118`)
    
    lem.addEventListener('load' , () => {
        const response = JSON.parse(lem.response)
        if(!localStorage.getItem('pokemons')){
            localStorage.setItem('pokemons' , JSON.stringify(response.results))
            localStorage.setItem('counter' , JSON.stringify('0'))
            localStorage.setItem('page' , JSON.stringify('0'))
        }else{
            return
        }
    })
    lem.send()
})

const getRequest = (url,  cb) => {
    const xhr = new XMLHttpRequest()
    let getPage = JSON.parse(localStorage.getItem('page'))

    xhr.open('GET' , `${url}?offset=${getPage}&limit=21`)
    xhr.addEventListener('load' , () => {
        const response = JSON.parse(xhr.response)
        cb(response)
    })
    xhr.send()
}

const container = document.querySelector('.container')
getRequest(base , cb => {
    const template = cb.results.map(({name, url}) => {
        return `
        <div onclick="getSinglePokemon('${url}')" class="card">
            <div class="card_wrapper">
                <div class="front">
                    <img src="https://www.freeiconspng.com/uploads/pokeball-transparent-image-15.png" alt="logo">
                </div>
                <div class="back">
                    <h3>${name}</h3>
                </div>
            </div>
        </div>
        `
    }).join('')
    container.innerHTML = template
});

const prev = document.querySelector('.prev')
const prevIcon = document.querySelector('.prev i')
const next = document.querySelector('.next')

prev.addEventListener('click' , e => {
    e.preventDefault()
    let limitCounter = JSON.parse(localStorage.getItem('counter'))
    if(limitCounter < 1){
        prev.classList.add('reshow')
        prevIcon.classList.add('reshow')
    }else{
        limitCounter--
        localStorage.setItem('counter' , JSON.stringify(limitCounter))
        prev.classList.remove('reshow')
        prevIcon.classList.remove('reshow')
    }

    let getPage = JSON.parse(localStorage.getItem('page'))
    if(getPage <= 0){
        return getPage = 0
    }else{
        getPage -=20;
        getRequest(base , cb => {
            const template = cb.results.map(({name, url}) => {
                return `
                <div onclick="getSinglePokemon('${url}')" class="card">
                    <div class="card_wrapper">
                        <div class="front">
                            <img src="https://www.freeiconspng.com/uploads/pokeball-transparent-image-15.png" alt="logo">
                        </div>
                        <div class="back">
                            <h3>${name}</h3>
                        </div>
                    </div>
                </div>
                `
            }).join('')
            container.innerHTML = template
        });
        localStorage.setItem('page' , JSON.stringify(getPage))
    }
    window.location.reload()
})

const nextIcon = document.querySelector('.next i')
next.addEventListener('click' , e => {
    e.preventDefault()
    let limitCounter = JSON.parse(localStorage.getItem('counter')) 

    if(limitCounter === 1108){
        next.classList.add('reshow')
        nextIcon.classList.add('reshow')
    }else{
        limitCounter++
        localStorage.setItem('counter' , JSON.stringify(limitCounter))
        next.classList.remove('reshow')
        nextIcon.classList.remove('reshow')
    }

    let getPage = JSON.parse(localStorage.getItem('page'))
    getPage = +getPage + 20;
    localStorage.setItem('page' , JSON.stringify(getPage))

    getRequest(base , cb => {
        const template = cb.results.map(({name, url}) => {
            return `
            <div onclick="getSinglePokemon('${url}')" class="card">
                <div class="card_wrapper">
                    <div class="front">
                        <img src="https://www.freeiconspng.com/uploads/pokeball-transparent-image-15.png" alt="logo">
                    </div>
                    <div class="back">
                        <h3>${name}</h3>
                    </div>
                </div>
            </div>
            `
        }).join('')
        container.innerHTML = template
    });
    window.location.reload()
})
 
function backCards(){
    window.location.reload()
}

function getSinglePokemon(url){
    const pagination = document.querySelector('.pagination')
    pagination.classList.add('remove')
    const getNewRequest = (url, cb) => {
        const cms = new XMLHttpRequest()
        cms.open('GET' , `${url}`)
        cms.addEventListener('load' , () => {
            const response = JSON.parse(cms.response)
            cb(response)
        })
        cms.send()
    }

    getNewRequest(url  , cb => {
        container.innerHTML = `
        <div class="single">
            <div onclick='backCards()' class='down'>Back</div>
                <div class="single_title">
                    <h2>${cb.name.toUpperCase()}</h2>
                </div>
                <div class="single_child single_child_alt">
                    <div class="single_picture">
                        <img src="${cb.sprites.other.dream_world.front_default}" alt="logo">
                    </div>
                </div>
                <div class="single_child single_child_alt1">
                    <h3>Experience: <span>${cb.base_experience}</span></h3>
                    <div class="single_wrapper">
                        <div class="single_inner"><h2>HP</h2><span style="width: ${cb.stats[0].base_stat}%;"></span></div>
                        <div class="single_inner"><h2>ATTACK</h2><span style="width: ${cb.stats[1].base_stat}%;"></span></div>
                        <div class="single_inner"><h2>DEFENSE</h2><span style="width: ${cb.stats[2].base_stat}%;"></span></div>
                        <div class="single_inner"><h2>SPECIAL-ATTACK</h2><span style="width: ${cb.stats[3].base_stat}%;"></span></div>
                        <div class="single_inner"><h2>SPECIAL-DEFENSE</h2><span style="width: ${cb.stats[4].base_stat}%;"></span></div>
                        <div class="single_inner"><h2>SPEED</h2><span style="width: ${cb.stats[5].base_stat}%;"></span></div>
                    </div>
                </div>
                <div class="single_child single_child_alt2">
                    <h2>About - <span>${cb.name.toUpperCase()}</span></h2>
                    <ul>
                        <li>
                            Weight: <span>${cb.weight}</span>
                        </li>
                        <li>
                            Height: <span>${cb.height}</span>
                        </li>
                        <li>
                            Type: <span>${cb.types[0].type.name}</span>
                        </li>
                    </ul>
                </div>
                <div class="single_child single_child_alt3">
                    <h2>Looks</h2>
                    <div class='single_content'>
                        <div>
                            <span><img src='${cb.sprites.front_default}'></span>
                            <h3>Front_Default</h3>
                        </div>
                        <div>
                        <span><img src='${cb.sprites.back_default}'></span>
                            <h3>Back_Default</h3>
                        </div>
                        <div>
                        <span><img src='${cb.sprites.front_shiny}'></span>
                            <h3>Front_Shiny</h3>
                        </div>
                        <div>
                        <span><img src='${cb.sprites.back_shiny}'></span>
                        <h3>Back_Shiny</h3>
                    </div>
                </div>
            </div>
        </div>
        `
    })
}

const searchInput = document.querySelector('.searchInput')
searchInput.addEventListener('input' , e => {
    const value = e.target.value.toUpperCase()
    if(value === ''){
        window.location.reload()
    }

    const getPokemons = JSON.parse(localStorage.getItem('pokemons'))
    let con = []
    getPokemons.forEach(item => {
        if(item.name.toUpperCase().includes(value)){
            con.push(item)
        }
    })

    const template = con.map(({name, url}) => {
        return `
        <div onclick="getSinglePokemon('${url}')" class="card">
            <div class="card_wrapper">
                <div class="front">
                    <img src="https://www.freeiconspng.com/uploads/pokeball-transparent-image-15.png" alt="logo">
                </div>
                <div class="back">
                    <h3>${name}</h3>
                </div>
            </div>
        </div>
        `
    }).join('')
    container.innerHTML = template
})

const getCounter = document.querySelector('.counter')
let getLimitCounter = JSON.parse(localStorage.getItem('counter'))
getCounter.innerHTML = getLimitCounter