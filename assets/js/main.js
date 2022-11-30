const container = document.getElementById('container');
const span = document.getElementById('msg');
const form = document.querySelector('form');
const body = document.body;

function changeIcon(icon) {
  if (icon === '01d') return `/assets/svg/clear-day.svg`;
  if (icon === '01n') return `/assets/svg/clear-night.svg`;
  if (icon === '02d') return `/assets/svg/partly-cloudy-day.svg`;
  if (icon === '02n') return `/assets/svg/partly-cloudy-night.svg`;

  icon = icon.replace(/\D+/g, '');

  if (icon === '03') return `/assets/svg/cloudy.svg`;
  if (icon === '04' || icon === '09' || icon === '10') return `/assets/svg/rain.svg`;
  if (icon === '11') return `/assets/svg/storm.svg`;
  if (icon === '13') return `/assets/svg/snow.svg`;
  if (icon === '50') return `/assets/svg/mist.svg`;
}

function msgExist() {
  const span = document.getElementById('msg');
  if (span) span.remove();
}

function createMessage(msg, messageClass) {
  msgExist();
  const span = document.createElement('span');

  span.id = 'msg';
  span.classList.add(messageClass);
  span.innerText = msg;
  body.appendChild(span);


  setTimeout(() => {
    span.remove(messageClass);
  }, 5000);
}

function createCont() {
  const div = document.createElement('div');
  div.classList.add('cont');
  return div;
}

function createContTop(city, country) {
  const cont = createCont();
  const h2 = document.createElement('h2');
  const span = document.createElement('span');
  const i = document.createElement('i');

  cont.classList.add('flex');
  h2.innerText = city;
  span.innerText = country;
  i.classList.add('fa-solid');
  i.classList.add('fa-location-dot');

  cont.appendChild(i);
  cont.appendChild(h2);
  cont.appendChild(span);
  container.appendChild(cont);
}

function createContCenter(temp, subTemp, icon) {
  const cont = createCont();
  const divFlex = document.createElement('div');
  const h3 = document.createElement('h3');
  const img = document.createElement('img');
  const p = document.createElement('p');

  divFlex.classList.add('flex');
  h3.innerText = temp;
  img.src = icon;
  p.innerText = subTemp;

  cont.appendChild(divFlex);
  divFlex.appendChild(h3);
  divFlex.appendChild(img);
  cont.appendChild(p);
  container.appendChild(cont);
}

function createContBottom(text) {
  const cont = createCont();
  const h4 = document.createElement('h4');

  cont.classList.add('flex');
  h4.innerText = text;
  cont.appendChild(h4);
  container.appendChild(cont);
}

function createContainerElements(name, country, temperature, subTemperature, icon, climateDescription) {
  container.innerHTML = ''
  createContTop(name, country);
  createContCenter(temperature, subTemperature, icon);
  createContBottom(climateDescription);
  container.classList.add('show');
}

async function getWeather(city) {
  const apiKey = '5eac9af907fedcc0bc548d41aaafbb28';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt_br&units=metric&appid=${apiKey}`;

  try {
    await axios(url)
      .then(response => response.data)
      .then(data => {
        const { main, name, sys, weather } = data;
        const { feels_like, temp, temp_min, temp_max } = main;
        const country = sys.country;
        const icon = changeIcon(weather[0].icon);
        const temperature = `${temp.toFixed(0)}°`;
        const subTemperature = `${temp_max.toFixed(0)}°/${temp_min.toFixed(0)}° RealFeel ${feels_like.toFixed(0)}°`;
        const climateDescription = weather[0].description;
        createContainerElements(name, country, temperature, subTemperature, icon, climateDescription);
        createMessage('Result found 😀', 'msgTrue');
      })
      .catch(() => {
        createMessage(`Sorry, result not found 😩`, 'msgFalse');
        return container.innerHTML = '';
      });
  } catch (error) {
    console.log(error);
    createMessage(`Sorry, result not found 😩`, 'msgFalse');
    return container.innerHTML = '';
  }
}

function saveCity(city) { localStorage.setItem('city', city); }

function getLocalStorage() {
  const city = localStorage.getItem('city');
  if (!city) return;
  getWeather(city);
}
getLocalStorage();

form.addEventListener('submit', e => {
  e.preventDefault();
  let city = form.querySelector('input');
  if (city.value.length <= 1 || !isNaN(city.value)) return;
  container.classList.remove('show');
  getWeather(city.value);
  saveCity(city.value);
  city.value = '';
});
