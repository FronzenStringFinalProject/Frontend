import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ChildDetail from "../pages/parent/ChildDetail.vue";
import ParentHome from "../pages/parent/ChildrenList.vue";
import ParentPage from "../pages/parent/ParentPage.vue";
import ChildQuiz from "../pages/children/ChildQuiz.vue";
import BaseInfo from "../pages/parent/childDetail/BaseInfo.vue";
import QuizGroupStatical from "../pages/parent/childDetail/statical/QuizGroupStatical.vue";
import CorrectTrendStatical from "../pages/parent/childDetail/statical/CorrectTrendStatical.vue";
import WrongAnsQuizRecord from "../pages/parent/childDetail/WrongAnsQuizRecord.vue";
import LoginPage from "../pages/LoginPage.vue";
import AuthorizeManager from "../utils/authorize.ts";
import ChildManage from "../pages/children/ChildManage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import CheckInRecord from "../pages/parent/childDetail/CheckInRecord.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage,
        props(to): { returnUri?: string } {
            const return_uri = to.query.return_uri;
            if (return_uri) {
                return {returnUri: return_uri.toString()}
            } else {
                return {}
            }
        },
    },
    {
        path: "/register",
        name: "register",
        component: RegisterPage,
    },
    {
        path: "/parent",
        component: ParentPage,
        name: "parent-page",
        redirect:"/parent/base",
        children: [
            {
                path: "base",
                name:"parent-base",
                component: ParentHome
            },
            {
                path: "child/:cid",
                name: "child-detail",
                component: ChildDetail,
                props: (route) => ({cid: parseInt(route.params.cid.toString(), 10)}),
                redirect:{name :"child-base"},
                children: [
                    {
                        path: "base",
                        name: "child-base",
                        component: BaseInfo,
                    },
                    {
                        path: "statical",
                        children: [
                            {
                                path: "quiz-group",
                                name: "quizGroup",
                                component: QuizGroupStatical
                            },
                            {
                                path: "correct-trend",
                                name: "correctTrend",
                                component: CorrectTrendStatical
                            }
                        ]
                    }, {
                        path: "wrong-record",
                        name: "wrongRecord",
                        component: WrongAnsQuizRecord
                    }, {
                        path: "check-record",
                        name: "checkRecord",
                        component: CheckInRecord
                    }
                ]
            },
        ]
    },
    {
        path: "/child",
        redirect: "/child/manage",
        children: [
            {
                path: "manage",
                name: "child-manage"
                , component: ChildManage
            },
            {
                path: "/quiz"
                , name: "child-quiz",
                component: ChildQuiz
            }
        ]
    }

]


export const route = createRouter({
    history: createWebHistory(), routes
})

route.beforeEach((to) => {
        console.log(to.path, AuthorizeManager.authorized(), AuthorizeManager.AuthorizeState())
        if (to.path === "/entry") {
            switch (AuthorizeManager.AuthorizeState()) {
                case "Parent":
                    return {name: "parent-page"}
                case "NoLogin":
                    return {name: "login"}
                case "Child":
                    return {name: "child-manage"}
            }
        } else {

            switch (AuthorizeManager.AuthorizeState()) {
                case "Parent":
                    if (to.path.startsWith("/parent")) {
                        return true
                    } else if (to.path.startsWith("/child")) {
                        return {name: "parent-page"}
                    } else {
                        return true
                    }
                case "Child":
                    if (to.path.startsWith("/child")) {
                        return true
                    } else if (to.path.startsWith("/parent")) {

                        return {name: "child-manage"}
                    } else {
                        return true
                    }
                case "NoLogin":
                    if (to.path.startsWith("/parent") || to.path.startsWith("/child")) {
                        return {name: "login", query: {return_uri: to.path}}
                    } else {
                        return true
                    }
            }

        }
    }
)
