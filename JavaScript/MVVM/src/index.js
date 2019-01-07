import MVVM from  './mvvm';
var vm = new MVVM({
    $id: '#test',
    data () {
        return {
            abc: 123,
            person: {
                name: 'zs',
                age: 25
            }
        }
    }
})
window.vm = vm;
