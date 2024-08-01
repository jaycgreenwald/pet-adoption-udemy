const template = document.querySelector("#pet-card-template")

const wrapper = document.createDocumentFragment()

async function start() {
  const weatherPromise = await fetch("https://api.weather.gov/gridpoints/MFL/110,50/forecast")
  const weatherData = await weatherPromise.json()

  const ourTemperature = weatherData.properties.periods[0].temperature

  document.querySelector("#temperature-output").textContent = ourTemperature

}

start()

async function petsArea() {
  const petsPromise = await fetch("https://creative-twilight-01af28.netlify.app/.netlify/functions/pets")
  const petsData = await petsPromise.json()
  petsData.forEach(pet => {    //"pet" is like the variable that holds each itteration of the array?
    const clone = template.content.cloneNode(true)

    // add species data to pet card
    clone.querySelector(".pet-card").dataset.species = pet.species

    clone.querySelector("h3").textContent = pet.name //get the h3 tag to contain the pet name
    clone.querySelector(".pet-description").textContent = pet.description
    clone.querySelector(".pet-age").textContent = createAgeText(pet.birthYear)

    if (!pet.photo) pet.photo = "images/fallback.jpg"

    clone.querySelector(".pet-card-photo img").src = pet.photo
    clone.querySelector(".pet-card-photo img").alt = `A ${pet.species} named ${pet.name}.`
    wrapper.appendChild(clone) //append each iteration to the wrapper variable
  })
  document.querySelector(".list-of-pets").appendChild(wrapper) // move the whole array to the html page last
}


petsArea()

function createAgeText(birthYear) {
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear
  if (age == 1) return "1 year old"
  if (age == 0) return "Less than a year old"

  // return age + " years old"  <-- one way to do this
  return `${age} years old`    // a different way to do this
}

// pet filter button code
const allButtons = document.querySelectorAll(".pet-filter button")

allButtons.forEach(el => {         // el is element
  el.addEventListener("click", handleButtonClick)
})


function handleButtonClick(e) {                 // e for event - arbitrary name
  // remove active class from any and all buttons
  allButtons.forEach(el => el.classList.remove("active"))

  // add active class to the button that was clicked
  e.target.classList.add("active")

  // actually filter results
  const currentFilter = e.target.dataset.filter
  document.querySelectorAll(".pet-card").forEach(el => {
    if (currentFilter == el.dataset.species || currentFilter == "all") {
      el.style.display = "grid"
    } else {
      el.style.display = "none"
    }

  })
}