var stripe = Stripe('pk_test_OjY8ysbQ7rVsq6yxhz9MOntF');
var elements = stripe.elements();


var card = elements.create('card', {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});

card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
  // Use the token to create a charge or a customer
  // https://stripe.com/docs/charges
    successElement.querySelector('.token').textContent = result.token.id;
    successElement.classList.add('visible');

    var form = document.querySelector('form');
    var amountValue = form.querySelector('input[name=cardholder-amount]').value
    var name = form.querySelector('input[name=cardholder-name]').value

    post('http://docker-pi.local:5000/sendPayement', {stripeToken : result.token.id, amount : amountValue, name : name})
  }
  else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
    }
}

card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = document.querySelector('form');
  var extraDetails = {
    name: form.querySelector('input[name=cardholder-name]').value,
  };
  stripe.createToken(card, extraDetails).then(setOutcome);
});


function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}
