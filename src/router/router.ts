import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ChildDetail from "../pages/parent/ChildDetail.vue";
import ParentHome from "../pages/parent/ChildrenList.vue";
import ParentPage from "../pages/parent/ParentPage.vue";
import ChildQuiz from "../pages/ChildQuiz.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/parent",
        component: ParentPage,
        children: [
            {
                path: "",
                component: ParentHome
            },
            {
                path: "child/:cid",
                name:"child-detail",
                component: ChildDetail,
                props: (route) => ({cid: parseInt(route.params.cid.toString(), 10)})
            },
        ]
    },
    {
        path: "/quiz", component: ChildQuiz
    }
]


export const route = createRouter({
    history: createWebHistory(), routes
})

route.beforeEach((to, from) => {
    return true
})