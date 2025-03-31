
function toggleAddressPopup(){
    const popup = document.getElementById(addressPopup);
    //popup.classList.toggle('hidden');
    popup.style.visibility = 'visible';
    popup.style.display = 'block';
}

function togglePaymentPopup(){
    const popup = document.getElementById(paymentPopup);
    popup.classList.toggle('hidden');
}