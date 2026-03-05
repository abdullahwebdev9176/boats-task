let selectedCondition = 'All';


function handleConditionClick(e) {
    e.preventDefault();

    const clicked = e.target.value;
    let items = $('.condition-item');

    if(clicked === 'all') {
        selectedCondition = 'All';
        items.prop('checked', false);
    }else{
        const anyChecked = items.toArray().some(item => item.checked);
        $('#condition-all').prop('checked', !anyChecked);
    }

}

// function handleConditionClick(e) {

//     const clicked = e.target.value;

//     const all = document.getElementById('condition-all');
//     const items = document.querySelectorAll('.condition-item');

//     const itemsArray = [...items];

//     if (clicked === 'all') {
//         itemsArray.forEach(item => item.checked = false);
//     } else {
//         const anyChecked = itemsArray.some(item => item.checked);
//         all.checked = !anyChecked;
//     }

//     const checkedItems = itemsArray.filter((i) => {
//         return i.checked;
//     })

//     checkedItemsValues = checkedItems.map((i) => {
//         return i.value;
//     })
// }