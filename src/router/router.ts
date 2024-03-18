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
        path: "/parent",
        component: ParentPage,
        children: [
            {
                path: "",
                component: ParentHome
            },
            {
                path: "child/:cid",
                name: "child-detail",
                component: ChildDetail,
                props: (route) => ({cid: parseInt(route.params.cid.toString(), 10)}),
                children: [
                    {
                        path: "",
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
                    }
                ]
            },
        ]
    },
    {
        path: "/child",
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

route.beforeEach((to, from) => {
    console.log(to.path, AuthorizeManager.authorized())
    if (to.path.startsWith("/parent")) {
        if (AuthorizeManager.authorized())
            return true
        else {
            return {name: "login", query: {return_uri: to.path}}
        }
    } else if (to.name == "login") {
        return true
    } else {
        return true
    }
})