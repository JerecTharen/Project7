console.log('Hello There');
let sortUp = '<i class="fas fa-sort-up"></i>';
let sortDown = '<i class="fas fa-sort-down"></i>';
let sortingUp;

if($('#sortUser').attr('class') === 'fas fa-sort-up'){
    sortingUp = true;
}
else{
    sortingUp = false;
}

function sortClick(field){
    let searchParam = $('#searchParam').val();
    console.log(searchParam);
    let href =  $(`#sort${field}Link`).attr('href');
    href += `?${sortingUp ? 'sortingUp=true' : 'sortingUp=false'}&field=${field}${searchParam ? '&searchParam=' + searchParam : ''}`;
    $(`#sort${field}Link`).attr('href', href);
}

$('#sortUser').click(sortClick('userName'));
$('#sortEmail').click(sortClick('email'));
$('#sortAge').click(sortClick('age'));
$('#sortFirst').click(sortClick('firstName'));
$('#sortLast').click(sortClick('lastName'));
