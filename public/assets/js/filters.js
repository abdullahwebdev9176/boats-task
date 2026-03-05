let selectedCondition = ['All'];

function handleConditionClick(e) {
    const clickedElement = $(e.target);
    const clickedValue = clickedElement.val();
    const items = $('.condition-item');
    const all = $('#condition-all');

    if (clickedValue === 'All') {

        items.prop('checked', false);
        all.prop('checked', true);
        selectedCondition = ['All'];
    } else {

        all.prop('checked', false);

        selectedCondition = items.filter(':checked').map(function() {
            return this.value;
        }).get();

        if (selectedCondition.length === 0) {
            selectedCondition = ['All'];
            all.prop('checked', true);
        }
    }

    console.log(selectedCondition);
}