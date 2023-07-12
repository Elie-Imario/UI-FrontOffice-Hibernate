<div class="sider-bar-side">
    <nav class="sidebar">
        <!-- sider-bar-header -->
        <!-- <button class="sidebar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation"></button> -->

        <div class="sidebar-collapse" id="collapsibleNavId">
            <div class="sidebar-brand"><span>Hibernate</span></div>
            <ul class="sidebar-nav">
                <li class="sidebar-nav-title-item">
                    <span class="m-l-10"><i class="bi bi-layout-text-window-reverse"></i><span class="m-l-15">Dashboard</span></span>
                </li>
                <div class="link-container">
                    <li class="sidebar-nav-item">
                        <a class="sidebar-nav-link <c:if test="${prof_link_active}">active-link</c:if> m-l-5" href="Professeur"><i class="fa fa-users"></i><span class="m-l-15">Professeur</span></a>
                    </li>
                    <li class="sidebar-nav-item">
                        <a class="sidebar-nav-link <c:if test="${salle_link_active}">active-link</c:if> m-l-5" href="Salle"><i class="fa fa-house-circle-check"></i><span class="m-l-15">Salle</span></a>
                    </li>
                    <li class="sidebar-nav-item">
                        <a class='sidebar-nav-link <c:if test="${occuper_link_active}">active-link</c:if> m-l-5' href="Occuper"><i class="fa fa-house-lock"></i><span class="m-l-15">Occuper</span></a>
                    </li>
                </div>
            </ul>
        </div>
    </nav>
</div>
