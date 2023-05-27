<%@ include file="../components/header.jsp"%>
<body>
    <!-- Sidebar -->
        <%@ include file="../components/sidebar.jsp"%>
    <!--  -->
    <!-- MainPannel -->
        <div class="main-side">
            <!-- main-side-header -->
            <div class="card-detail-container m-t-40 limiter">
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-users"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Effectif Prof</span>
                        <div class="stat-section m-t-15">
                            <span id="totalProf"><c:out value="${totalProf}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail active">
                    <div class="ico-card"><span><i class="fa fa-house-circle-check"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Total Salle</span>
                        <div class="stat-section m-t-15">
                            <span id="totalSalle"><c:out value="${totalSalle}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-house-lock"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Salle Occupée</span>
                        <div class="stat-section m-t-15">
                            <span id="totalOcc"><c:out value="${totalOcc}"></c:out></span>
                        </div>
                    </div>
                </div>
            </div>
            <!--  -->

            <!-- Filtre avancée -->
            <!-- <div class="filtreAvance-section m-t-50 limiter" id="accordion_search_prof" role="tablist" aria-multiselectable="true">
                <div class="filtreAvance-content">
                    <div class="ico-accordion"><span><i class="fa fa-search"></i></span></div>
                    <div class="heading-content" role="tab" id="headingOne">
                        <h4 class="content-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion_search_prof" href="#search_prof"
                            aria-expanded="true" aria-controls="collapseOne" title="Afficher/Masquer les filtres"
                            class="accordion-title collapsed">
                                <i class="fa fa-angle-up"></i>
                            </a>
                        </h4>
                    </div>
                    <div id="search_prof" class="content-body collapse" role="tabpanel" aria-labelledby="headingOne">
                        <form class="accordion-form" id="search_prof_form">
                            <div class="field-row">
                                <div class="wrap-input100">
                                    <label for="input100-username">Code Prof</label>
                                    <input type="text" name="username" class="input100 m-t-15" id="input100-username" placeholder="johndoe">
                                </div>
                                <div class="wrap-input100">
                                    <label for="input100-email">Nom du Prof</label>
                                    <input type="email" name="email" class="input100 m-t-15" id="input100-email" placeholder="johndoe@gmail.com">
                                </div>
                            </div>
                            <div class="button_group m-t-20">
                                <button class="btn-form primary-btn" id="searchBook" type="button"
                                        title="Rechercher">
                                    <i class="fa fa-search"></i>
                                    Rechercher
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="reinitialiserOuvrageSearch"
                                        title="Réinitialiser">
                                    <i class="fa fa-times"></i>
                                    Réinitialiser
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> -->
            <!---->
            <!-- Alert Section -->
            <div class="alert-container">
                <div class="alert-success">
                    <div class="ico-alert"><span class="shake"><i class="bi bi-bell"></i></span></div>
                    <div class="alert-success-content">
                        <span class="close-btn"><i class="fa fa-times-circle"></i></span>
                        <span class="alertmsg"></span>
                    </div>
                </div>
            </div>
            <!---->
            <!--  -->

            <!-- Tab -->
            <div class="tab-list-container m-t-60 limiter">
                <div class="tablist-section">
                    <div class="tab-header-section">
                        <h3 class="table-header-title-lead ">LISTE DES SALLES</h3>
                        <button class="btn-add primary-btn" id="addSalle" type="button"
                                title="Ajouer une salle">
                            <i class="bi bi-house-door m-r-5"></i>
                            Ajouter
                        </button>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered table-condensed tablelisteSalle">
                        <thead>
                            <tr>
                                <th>CodeSal</th>
                                <th>Designation</th>
                                <th class="no-sorting"></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                            <c:forEach items="${salles}" var="salle">
                            <tr id="row<c:out value="${salle.id_Salle}"></c:out>">
                                <td><c:out value="${salle.id_Salle}"></c:out></td>
                                <td><c:out value="${salle.designation}"></c:out></td>
                                <td>
                                    <div class="options">
                                        <button type="button" class="option-btn-item" onclick='initUpdateSalle(<c:out value="${salle.id_Salle}"/>)'><i class="fa fa-edit"></i></button>
                                        <button type="button" class="option-btn-item" onclick='deleteSalle(<c:out value="${salle.id_Salle}"/>)'><i class="fa fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            </c:forEach>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!--  -->
            
            <!-- Add-form-popup -->
            <div class="modal-limiter">
                <div class="overlay"></div>
                <div class="container-input100 addModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-add-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title">
                                Ajouter une Salle
                            </span>
                        </div>
                        <form action="" class="add-salle-form m-t-30">
                            <div class="wrap-input100">
                                <label for="input100-designation">Designation</label>
                                <input type="text" class="input100 m-t-10" id="input100-designation" placeholder="....." name="DesignationToAdd">
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_add_salle" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_add_salle">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>                    
                </div>

                <!-- edit-form-popup -->
                <div class="container-input100 editModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-edit-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title" id="editModalPopUp-header">

                            </span>
                        </div>
                        <form action="" class="add-salle-form m-t-30">
                            <input type="hidden" name="IdSalle">
                            <div class="wrap-input100">
                                <label for="input100-designation_">Designation</label>
                                <input type="text" class="input100 m-t-10" id="input100-designation_" placeholder="....."  name="DesignationToEdit">
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_edit_salle" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_edit_salle">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    <!--  -->
    <script src="js/script_salle.js"></script>
</body>
</html>