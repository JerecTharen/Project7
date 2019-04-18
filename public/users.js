console.log('Hello There');
let sortUp = '<i class="fas fa-sort-up"></i>';
let sortDown = '<i class="fas fa-sort-down"></i>';
let sortingUp = true;

$('#sortUser').click(()=>{
    let searchParam = $('#searchParam').val();
    let data = {
        searchParam: searchParam,
        sortingUp: sortingUp,
        field: 'userName'
    };
    console.log(searchParam);
    $.ajax({
        url: '/users',
        data
    });
});
