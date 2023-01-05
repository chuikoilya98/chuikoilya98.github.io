let nanoid = (t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");

const swiper = new Swiper('.swiper', {
  autoplay: {
    delay: 5000,
  },
  centeredSlides: true,
  loop: true,
  slidesPerView: 1,
  speed: 800,
  pagination: {
    el: '.swiper-pagination',
  },
});

const swiper2 = new Swiper('.swiper2', {
  autoplay: {
    delay: 5000,
  },
  centeredSlides: true,
  loop: true,
  slidesPerView: 1,
  speed: 1000,
});

let order = [];
const total = document.querySelector('#total-sum');

const calculateTotal = () => {
  let sum = 0;

  for (let d of order) {
    let price = d.amount * d.price;
    sum += price;
  }

  total.innerText = sum + ' Р';
};

const checkButtons = () => {
  const buttons = document.querySelectorAll('button.btn-add');
  if (buttons) {
    buttons.forEach(b => {
      const name = b.dataset.name;
      const dishAdded = order.find(d => d.name === name);

      if (dishAdded) {
        const image = b.querySelector('img');
        const text = b.querySelector('span');
        image.src = './images/done.svg';
        text.textContent = 'В заказе';
        b.classList.add('disabled');
      } else {
        const image = b.querySelector('img');
        const text = b.querySelector('span');
        image.src = './images/plus.svg';
        text.textContent = 'Добавить';
        b.classList.remove('disabled');
      }
    })
  }
};

const deleteDish = (id) => {
  const dish = document.querySelector(`.dish[data-id="${id}"]`);
  if (dish) {
    dish.remove();
  }
};

const deleteDishByName = (name) => {
  order = order.filter(d => {
    return d.name !== name;
  });
};

const decrementDish = ({ id , name }) => {
  const amount = document.querySelector(`.amount[data-id="${id}"]`);
  let value = +amount.innerText;

  if (value === 1) {
    deleteDish(id);
    deleteDishByName(name);
    checkButtons();
    calculateTotal();
    return;
  }

  value--;
  amount.innerText = value;
};

const incrementDish = (name) => {
  const amount = document.querySelector(`.amount[data-name="${name}"]`);
  let value = +amount.innerText;
  value++;
  amount.innerText = value;
  calculateTotal();
};

const createOrderCard = (dish) => {
  const dishCard = document.createElement('article');
  const id = nanoid(10);
  dishCard.classList.add('dish');
  dishCard.dataset.name = dish.name;
  dishCard.dataset.id = id;
  dishCard.dataset.type = 'card';

  const aside = document.createElement('aside');
  aside.style.backgroundImage = `url(${dish.image})`;

  dishCard.appendChild(aside);

  const content = document.createElement('div');
  content.classList.add('content');

  const main = document.createElement('main');
  const h3 = document.createElement('h3');
  const info1 = document.createElement('div');
  const info1key = document.createElement('div');
  const info1value = document.createElement('div');
  const info2 = document.createElement('div');
  const info2key = document.createElement('div');
  const info2value = document.createElement('div');
  const footer = document.createElement('footer');
  const price = document.createElement('price');
  const actions = document.createElement('div');
  const minus = document.createElement('button');
  const amount = document.createElement('div');
  const plus = document.createElement('button');

  minus.dataset.id = id;
  amount.dataset.id = id;
  amount.dataset.name = dish.name;
  plus.dataset.id = id;

  minus.addEventListener('click', function () {
    decrementDish({
      id,
      name: dish.name
    });
  });

  plus.addEventListener('click', function () {
    incrementDish(dish.name);
  });

  info1.classList.add('info');
  info2.classList.add('info');
  info1key.classList.add('info-key');
  info2key.classList.add('info-key');
  info1value.classList.add('info-value');
  info2value.classList.add('info-value');
  price.classList.add('price');
  actions.classList.add('actions');
  minus.classList.add('minus');
  amount.classList.add('amount');
  plus.classList.add('plus');

  h3.textContent = dish.name;
  info1key.textContent = 'Масса';
  info2key.textContent = 'Время приготовления';
  info1value.textContent = dish.weight + ' г';
  info2value.textContent = dish.time;
  price.textContent = dish.price + ' Р';
  minus.textContent = '-';
  amount.textContent = dish.amount;
  plus.textContent = '+';

  info1.appendChild(info1key);
  info1.appendChild(info1value);
  info2.appendChild(info2key);
  info2.appendChild(info2value);

  main.appendChild(h3);
  main.appendChild(info1);
  main.appendChild(info2);

  actions.appendChild(minus);
  actions.appendChild(amount);
  actions.appendChild(plus);

  footer.appendChild(price);
  footer.appendChild(actions);

  content.appendChild(main);
  content.appendChild(footer);

  dishCard.appendChild(content);

  return dishCard;
};

const buttonsAdd = document.querySelectorAll('.btn-add');
const orderElem = document.querySelector('#order');

buttonsAdd.forEach(btn => {
  btn.addEventListener('click', event => {
    const { name, time, weight, price, image } = event.target.dataset;
    const dish = {
      name,
      time,
      weight,
      price,
      image,
      amount: 1
    };

    if (!dish.name) {
      return;
    }

    const dishAdded = order.find(d => d.name === dish.name);

    if (dishAdded) {
      dishAdded.amount++;
      incrementDish(name);
    } else {
      order.push(dish);
      orderElem.appendChild(createOrderCard(dish));
    }

    checkButtons();
    calculateTotal();
  });
});
