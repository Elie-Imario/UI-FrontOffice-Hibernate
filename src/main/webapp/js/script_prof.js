$(document).ready(function(){
    $(".tablelisteProf").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
        "bDestroy": true
    })


    $('#addProf').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_add_prof').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_prof').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    $('.dropdown-toggle').on('click', function(){
        //showDropDownMenu()
    })

    $(".close-btn").click(function () {
        closeAlert()
    })


    /*****************************
     * CRUD OPERATION
     */
    $('#confirm_submit_prof').on('click', function () {
        let firstname_input = $("input[name='firstnameProfToAdd']")
        let lastname_input = $("input[name='lastnameProfToAdd']")
        let grade_select = $("select[name='gradeProfToAdd']")

        addProf(firstname_input, lastname_input, grade_select)
    })

    $('#confirm_edit_prof').on('click', function () {
        let newfirstname_input = $("input[name='firstnameProfToEdit']")
        let newlastname_input = $("input[name='lastnameProfToEdit']")
        let newgrade_select = $("select[name='gradeProfToEdit']")

        updateLecteur(newfirstname_input, newlastname_input, newgrade_select)
    })

    //RECHERCHE
    $("#searchProf_btn").click(function(){
        console.log("click")
        let searchParams = []
        searchParams.push($("input[name='id_prof_for_search']").val(), $("input[name='name_prof_for_search']").val())
        $(".tablelisteProf").DataTable().column(0).search(searchParams[0]).column(1).search(searchParams[1]).draw()
    })
    $("#reinitialiserProfSearch").click(function () {
        $(".tablelisteProf").DataTable().column(0).search("").column(1).search("").draw()
    })

 })

/* Implement  functions*/
function closeModal(popuptoClose){
    $('.modal-limiter').removeClass('show')
    $(popuptoClose).addClass('hide')
}
function showModal(popuptoshow){
    $('.modal-limiter').addClass('show')
    $(popuptoshow).removeClass('hide')
}
function showDropDownMenu(){
    $('.dropdown-additonal-menu').addClass('show')   
}

function addProf(_firstname_input, _lastname_input, _grade_select){
    $.ajax({
        type: "POST",
        data:{
            firstname: _firstname_input.val(),
            lastname: _lastname_input.val(),
            grade : _grade_select.val(),
            RequestType: "AddProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 201){
                    $.ajax({
                        type: "POST",
                        data:{
                            RequestType: "GetLastInsertProf"
                        },
                        url: "Professeur",
                        cache: false,
                        dataType: "json",
                        success: function (data){
                            $.each(data, (index, response) => {
                                let _options = '<div class="options">'+
                                    '<button type="button" class="option-btn-item" onclick="initUpdateProf('+ response.id_prof +')"><span><i class="fa fa-edit"></i></span></button>'+
                                    '<button type="button" class="option-btn-item" onclick="deleteProf('+ response.id_prof +')"><span><i class="fa fa-trash"></i></span></button>'+
                                    '</div>'
                                let data = [response.id_prof, response.nom, response.prenom, response.grade, _options]

                                $(".tablelisteProf").dataTable().fnAddData(data)
                                $(".tablelisteProf tbody tr:first").attr('id', 'row'+response.id_prof)
                            })
                        }
                    })
                    closeModal(".container-input100.addModalPopUp");
                    getTotalProf()
                    let inputs = $("input")
                    for(let i=0; i<inputs.length; i++){
                        inputs[i].value = ""
                    }
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function initUpdateProf(idProf){
    $.ajax({
        type: "POST",
        data:{
            Id_Prof: idProf,
            RequestType : "getProfById"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                $("#editModalPopUp-header").text("Modifier Prof N°"+response.id_prof)
                $("input[name='IdProf']").val(response.id_prof)
                $("input[name='firstnameProfToEdit']").val(response.nom)
                $("input[name='lastnameProfToEdit']").val(response.prenom)
                $("select[name='gradeProfToEdit']").val("")
                $("option[value="+"'"+response.grade+"'"+"]").attr("selected", "selected")
                $("select[name='gradeProfToEdit']").val($("option[selected='selected']").val())

                showModal(".container-input100.editModalPopUp")
            })
        }
    })
}

function updateLecteur(_newFirstnameinput, _newlastnameinput, _newgradeselect){
    let IndexProfToUpdate = $("input[name='IdProf']").val()

    $.ajax({
        type: "POST",
        data:{
            Id_Prof: IndexProfToUpdate,
            newfirstname: _newFirstnameinput.val(),
            newlastname: _newlastnameinput.val(),
            newgrade : _newgradeselect.val(),
            RequestType: "UpdateProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 200) {
                    let row = $("#row"+IndexProfToUpdate+"")
                    let options = '<div class="options">'+
                        '<button type="button" class="option-btn-item" onclick="initUpdateProf('+IndexProfToUpdate+')"><span><i class="fa fa-edit"></i></span></button>'+
                        '<button type="button" class="option-btn-item" onclick="deleteProf('+IndexProfToUpdate+')"><span><i class="fa fa-trash"></i></span></button>'+
                        '</div>'
                    let newData = [IndexProfToUpdate,_newFirstnameinput.val(),_newlastnameinput.val(),_newgradeselect.val(),options]

                    $(".tablelisteProf").DataTable().row(row).data(newData).draw(false)
                    closeModal(".container-input100.editModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function deleteProf(IdProf){
    if(confirm("Voulez-vous supprimer le professeur "+IdProf+" ?")){
        $.ajax({
            type: "POST",
            data: {
                Id_Prof: IdProf,
                RequestType: "DeleteProf"
            },
            url: "Professeur",
            cache: false,
            dataType: "json",
            success:function (data) {
                $.each(data, (index, response)=>{
                    if(response.requestStatusCode == 204){
                        let row = $("#row"+IdProf+"")
                        $(".tablelisteProf").dataTable().fnDeleteRow(row)
                        getTotalProf()
                        getTotalOcc()
                        showAlert(response.sucessMsg)
                    }
                })
            }
        })
    }
}
function getTotalProf(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalProf").text(data.TotalProf)
        }
    })
}

function getTotalOcc(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalOcc"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalOcc").text(data.TotalOcc)
        }
    })
}

function showAlert(alertMsg){
    if ($(".alert-success").hasClass("disappered")) {
        $(".alert-success").removeClass("disappered");
        $(".alert-success").addClass("displayed");

    }

    $(".alertmsg").text(alertMsg)
    $(".alert-success").addClass("displayed")

    setTimeout(() => {
        $(".alert-success").removeClass("displayed")
        $(".alert-success").addClass("disappered")
    }, 5000)

    clearInterval()
}

function closeAlert(){
    $(".alert-success").removeClass("displayed")
    $(".alert-success").addClass("disappered")
}




