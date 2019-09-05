import {STYLES} from './styles.js'

export const UI_TEMPLATE = `
${STYLES}
<div id="controlPanel" style="font-family: 'Helvetica Neue', Arial, sans-serif; position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; background:#000; z-index: 9999;">
  <div id="container" style="overflow: hidden; position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 0px solid transparent; border-radius: .28571429rem; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: space-between;">
    <div style="position: relative; border-bottom: 0px solid #ddd; margin-top: 0; text-align: center;">
      <img style="width: 600px;" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53%0D%0AMy5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OTMuOTYiIGhlaWdodD0iNjkuNTUiIHZpZXdCb3g9IjAg%0D%0AMCA0OTMuOTYgNjkuNTUiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojYTFjZDQ1O30uY2xzLTJ7%0D%0AZmlsbDojZmViZTE4O30uY2xzLTN7ZmlsbDojZjk5ZDI3O30uY2xzLTR7ZmlsbDojZWUzNjhlO30u%0D%0AY2xzLTV7ZmlsbDojMDBhZGRiO30uY2xzLTYsLmNscy03e2ZpbGw6IzFiMjQzZDt9LmNscy02e2Zp%0D%0AbGwtcnVsZTpldmVub2RkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+Z2l2ZWF3YXlCb3RIZWFkZXI8%0D%0AL3RpdGxlPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMzUwLjE2IiB5PSIxLjQ0IiB3aWR0aD0iNi40%0D%0AIiBoZWlnaHQ9IjEyLjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjQ3IDI3LjI0KSByb3RhdGUo%0D%0ALTQuNDEpIi8+PHJlY3QgY2xhc3M9ImNscy0yIiB4PSIzMjYuNDEiIHk9IjE0LjA0IiB3aWR0aD0i%0D%0ANi40IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2LjIxIDI4Ni4xMSkgcm90%0D%0AYXRlKC01Ny41MykiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjQ0NC44OCIgeT0iMzIuNDciIHdp%0D%0AZHRoPSI2LjQiIGhlaWdodD0iNi40IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzUuNTMgMzk0LjU5%0D%0AKSByb3RhdGUoLTU3LjUzKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMjk4Ljk4IiB5PSI1Mi45%0D%0AMyIgd2lkdGg9IjYuNCIgaGVpZ2h0PSIxMS42Ii8+PHJlY3QgY2xhc3M9ImNscy01IiB4PSIzNjAu%0D%0AMzMiIHk9IjQ4LjU1IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xh%0D%0AdGUoNjcuOTYgMjcyLjI0KSByb3RhdGUoLTQ1KSIvPjxyZWN0IGNsYXNzPSJjbHMtNSIgeD0iMjYu%0D%0ANDEiIHk9IjU1Ljk2IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjEyLjEiIHRyYW5zZm9ybT0idHJhbnNs%0D%0AYXRlKC00MC42MSA1NC40OCkgcm90YXRlKC01OC4xNikiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9%0D%0AIjI3Mi4wOSIgeT0iNjAuMDIiIHdpZHRoPSI2LjQiIGhlaWdodD0iNi40IiB0cmFuc2Zvcm09InRy%0D%0AYW5zbGF0ZSgtNi44OCA5OC40Nykgcm90YXRlKC0yMC4xKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIg%0D%0AeD0iNDE5LjQzIiB5PSIzNy41MyIgd2lkdGg9IjcuMiIgaGVpZ2h0PSI3LjIiIHRyYW5zZm9ybT0i%0D%0AdHJhbnNsYXRlKDYuMzMgMTMzLjg5KSByb3RhdGUoLTE4LjE2KSIvPjxyZWN0IGNsYXNzPSJjbHMt%0D%0AMSIgeD0iNDg4LjIzIiB5PSIwLjg2IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuMiIgdHJhbnNmb3Jt%0D%0APSJ0cmFuc2xhdGUoMzgwLjM4IDQ4My4xNykgcm90YXRlKC03Ny42MykiLz48cmVjdCBjbGFzcz0i%0D%0AY2xzLTEiIHg9IjQwMC4yNCIgeT0iNTQuNDMiIHdpZHRoPSI2LjQiIGhlaWdodD0iNi4yIiB0cmFu%0D%0Ac2Zvcm09InRyYW5zbGF0ZSgyNTguOTIgNDM5LjMxKSByb3RhdGUoLTc3LjYzKSIvPjxyZWN0IGNs%0D%0AYXNzPSJjbHMtMSIgeD0iMjIxLjk1IiB5PSI2MC4wNyIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQi%0D%0AIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMy4yIDI2OS42Nikgcm90YXRlKC03Ny42MykiLz48cmVj%0D%0AdCBjbGFzcz0iY2xzLTQiIHg9IjEzNi42OSIgeT0iMjIuNzYiIHdpZHRoPSI3LjIiIGhlaWdodD0i%0D%0ANy4yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMy4xNSA0NS4wNikgcm90YXRlKC0xOC4xNikiLz48%0D%0AcmVjdCBjbGFzcz0iY2xzLTIiIHg9IjE1Ny42NSIgeT0iNC41NSIgd2lkdGg9IjExLjkiIGhlaWdo%0D%0AdD0iNi40IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQuOTMgMTcwLjcxKSByb3RhdGUoLTg2Ljg0%0D%0AKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iNDU4Ljc2IiB5PSI1Ni4xMSIgd2lkdGg9IjYuNCIg%0D%0AaGVpZ2h0PSIxMS42IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ny43NiAzNTUuMTgpIHJvdGF0ZSgt%0D%0ANDYuNjIpIi8+PHJlY3QgY2xhc3M9ImNscy0yIiB4PSI0ODguMjYiIHk9IjU4LjEyIiB3aWR0aD0i%0D%0ANi40IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTczLjk5IDQ0My4wOCkgcm90%0D%0AYXRlKC01Ny41MykiLz48cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjIyNS42NyIgeT0iNS40MSIgd2lk%0D%0AdGg9IjYuNCIgaGVpZ2h0PSI2LjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk2LjgzIDE5Ny4xMikg%0D%0Acm90YXRlKC01Ny41MykiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjM4MC44OSIgeT0iNTcuNDMi%0D%0AIHdpZHRoPSI2LjQiIGhlaWdodD0iMTEuNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzMuOTcgMzAx%0D%0ALjAzKSByb3RhdGUoLTQ3KSIvPjxyZWN0IGNsYXNzPSJjbHMtNSIgeD0iNDE0LjYiIHk9IjYuMjYi%0D%0AIHdpZHRoPSI2LjQiIGhlaWdodD0iMTIuMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg1LjAyIDM2%0D%0AMC43OCkgcm90YXRlKC01OC4xNikiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjQ4NS4xIiB5PSIy%0D%0AMS40MiIgd2lkdGg9IjYuNCIgaGVpZ2h0PSIxMi4xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDUu%0D%0ANDUgNDI3LjgzKSByb3RhdGUoLTU4LjE2KSIvPjxyZWN0IGNsYXNzPSJjbHMtMyIgeD0iNDY0Ljkx%0D%0AIiB5PSIxMC4zNSIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQiIHRyYW5zZm9ybT0idHJhbnNsYXRl%0D%0AKDIxLjkzIDE2MS43KSByb3RhdGUoLTIwLjEpIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIzNzYu%0D%0ANyIgeT0iMzAuODYiIHdpZHRoPSIxMi44IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xh%0D%0AdGUoLTAuODMgNzguNykgcm90YXRlKC0xMS43NCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjM0%0D%0ANi4yNCIgeT0iMjUuMDgiIHdpZHRoPSI3LjIiIGhlaWdodD0iNy4yIiB0cmFuc2Zvcm09InRyYW5z%0D%0AbGF0ZSg2LjU2IDExMC40Nykgcm90YXRlKC0xOC4xNikiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9%0D%0AIjQ2OC45OCIgeT0iNDAuNTIiIHdpZHRoPSI2LjQiIGhlaWdodD0iNi4yIiB0cmFuc2Zvcm09InRy%0D%0AYW5zbGF0ZSgzMjYuNTIgNDk1LjUzKSByb3RhdGUoLTc3LjYzKSIvPjxyZWN0IGNsYXNzPSJjbHMt%0D%0ANCIgeD0iMzAyLjA4IiB5PSIxLjMzIiB3aWR0aD0iNi40IiBoZWlnaHQ9IjExLjYiLz48cmVjdCBj%0D%0AbGFzcz0iY2xzLTEiIHg9IjI2My4zMSIgeT0iMi4zNyIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQi%0D%0AIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwMi4wNyAyNjQuNzIpIHJvdGF0ZSgtNzcuNjMpIi8+PHJl%0D%0AY3QgY2xhc3M9ImNscy0zIiB4PSI0MjguNzMiIHk9IjU5LjM4IiB3aWR0aD0iNi40IiBoZWlnaHQ9%0D%0AIjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ1LjM1IDM5My40NCkgcm90YXRlKC01Ny41Myki%0D%0ALz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjEyOC42NCIgeT0iLTAuMDUiIHdpZHRoPSI2LjQiIGhl%0D%0AaWdodD0iMTIuMSIgdHJhbnNmb3JtPSJtYXRyaXgoMC4xNSwgLTAuOTksIDAuOTksIDAuMTUsIDEw%0D%0ANC42MSwgMTM1LjU1KSIvPjxyZWN0IGNsYXNzPSJjbHMtMyIgeD0iMzIzLjEzIiB5PSI0NS44OCIg%0D%0Ad2lkdGg9IjUuNyIgaGVpZ2h0PSI2LjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU4Ljg1IDI0NC45%0D%0AMSkgcm90YXRlKC00NSkiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjE4OS40OCIgeT0iNTMuNjgi%0D%0AIHdpZHRoPSI1LjciIGhlaWdodD0iNi40IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC4xOSAxNTIu%0D%0ANjkpIHJvdGF0ZSgtNDUpIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIzNDIuMDYiIHk9IjYwLjc1%0D%0AIiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjA3LjAzIDM4%0D%0ANy40NSkgcm90YXRlKC03Ny42MykiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjQ0MS42IiB5PSIz%0D%0ALjEzIiB3aWR0aD0iMTIuOCIgaGVpZ2h0PSI2LjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMTcg%0D%0AOTEuMzMpIHJvdGF0ZSgtMTEuNzQpIi8+PHJlY3QgY2xhc3M9ImNscy01IiB4PSI0LjYxIiB5PSI0%0D%0ALjU1IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUuMTEg%0D%0ANy44Mikgcm90YXRlKC00NSkiLz48cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjM3Ny45MiIgeT0iNC44%0D%0ANSIgd2lkdGg9IjYuNCIgaGVpZ2h0PSIxMS45IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMzAuNSAz%0D%0ANjEuOSkgcm90YXRlKC02OC42NykiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjE5LjE5IiB5PSIz%0D%0ANi41NyIgd2lkdGg9IjcuMiIgaGVpZ2h0PSI3LjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMy4z%0D%0AIDkuMTMpIHJvdGF0ZSgtMTguMTYpIi8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSI4My42OCIgeT0i%0D%0AMjkuNzMiIHdpZHRoPSI2LjQiIGhlaWdodD0iMTEuNiIvPjxyZWN0IGNsYXNzPSJjbHMtMyIgeD0i%0D%0AMTA2LjAyIiB5PSIxNi45NCIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQiIHRyYW5zZm9ybT0idHJh%0D%0AbnNsYXRlKDMxLjY4IDEwMS41KSByb3RhdGUoLTU3LjUzKSIvPjxyZWN0IGNsYXNzPSJjbHMtMiIg%0D%0AeD0iNjEuMzUiIHk9IjUzLjQyIiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuNCIgdHJhbnNmb3JtPSJ0%0D%0AcmFuc2xhdGUoLTE5Ljc5IDgwLjcyKSByb3RhdGUoLTU3LjUzKSIvPjxyZWN0IGNsYXNzPSJjbHMt%0D%0ANCIgeD0iMi42OCIgeT0iNTUuOTMiIHdpZHRoPSI2LjQiIGhlaWdodD0iMTEuNiIvPjxyZWN0IGNs%0D%0AYXNzPSJjbHMtNSIgeD0iMTQ0LjUyIiB5PSI1My40NSIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQi%0D%0AIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjkgMTIxLjA3KSByb3RhdGUoLTQ1KSIvPjxyZWN0IGNs%0D%0AYXNzPSJjbHMtNSIgeD0iODUuNTciIHk9IjU5Ljk2IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuNCIg%0D%0AdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjU4IDgxLjMpIHJvdGF0ZSgtNDUpIi8+PHJlY3QgY2xh%0D%0Ac3M9ImNscy01IiB4PSIxOTAuMTciIHk9IjEuMyIgd2lkdGg9IjYuNCIgaGVpZ2h0PSI2LjQiIHRy%0D%0AYW5zZm9ybT0idHJhbnNsYXRlKDUxLjU0IDEzOC4wOCkgcm90YXRlKC00NSkiLz48cmVjdCBjbGFz%0D%0Acz0iY2xzLTMiIHg9IjI2LjM5IiB5PSI2LjQ0IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuNCIgdHJh%0D%0AbnNmb3JtPSJ0cmFuc2xhdGUoLTMuNDMgMTAuNzgpIHJvdGF0ZSgtMjAuMSkiLz48cmVjdCBjbGFz%0D%0Acz0iY2xzLTEiIHg9IjExOC4zIiB5PSI0NC42NiIgd2lkdGg9IjEyLjgiIGhlaWdodD0iNi40IiB0%0D%0AcmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAuNzcgNDUuNzkpIHJvdGF0ZSgtMjAuMSkiLz48cmVjdCBj%0D%0AbGFzcz0iY2xzLTEiIHg9IjIuNjMiIHk9IjI0LjIyIiB3aWR0aD0iMTIuOCIgaGVpZ2h0PSI2LjQi%0D%0AIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC43OSA0LjgpIHJvdGF0ZSgtMjAuMSkiLz48cmVjdCBj%0D%0AbGFzcz0iY2xzLTIiIHg9Ijc5LjY1IiB5PSIzLjk1IiB3aWR0aD0iMTEuOSIgaGVpZ2h0PSI2LjQi%0D%0AIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxLjgyIDkyLjI1KSByb3RhdGUoLTg2Ljg0KSIvPjxyZWN0%0D%0AIGNsYXNzPSJjbHMtMiIgeD0iNDEuMDUiIHk9IjM0LjM1IiB3aWR0aD0iMTEuOSIgaGVpZ2h0PSI2%0D%0ALjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUgODIuNDQpIHJvdGF0ZSgtODYuODQpIi8+PHJlY3Qg%0D%0AY2xhc3M9ImNscy0xIiB4PSI1Ni45IiB5PSI3Ljc2IiB3aWR0aD0iNi40IiBoZWlnaHQ9IjYuMiIg%0D%0AdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuNzEgNjcuMjcpIHJvdGF0ZSgtNzcuNjMpIi8+PHJlY3Qg%0D%0AY2xhc3M9ImNscy0xIiB4PSIxNjMuOTMiIHk9IjU5LjQiIHdpZHRoPSI2LjQiIGhlaWdodD0iNi40%0D%0AIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OC4yNyAyMTIuNDYpIHJvdGF0ZSgtNzcuNjMpIi8+PHJl%0D%0AY3QgY2xhc3M9ImNscy0xIiB4PSIxNjAuOTQiIHk9IjI2LjIyIiB3aWR0aD0iOC41IiBoZWlnaHQ9%0D%0AIjguMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTguMjcgMTg1LjIpIHJvdGF0ZSgtNzcuNjMpIi8+%0D%0APHBhdGggY2xhc3M9ImNscy02IiBkPSJNMjkwLjE3LDQ2LjY1QzI3OS4zLDU0LjYyLDI2My4zNiw1%0D%0AOSwyNDkuNzcsNTlhNzMsNzMsMCwwLDEtNDkuMjgtMTguODRjLTEuMDktLjkxLS4xOS0yLjE3LDEu%0D%0AMDgtMS40NWE5OSw5OSwwLDAsMCw0OS4yOSwxMyw5Ny40MSw5Ny40MSwwLDAsMCwzNy42OC03Ljhj%0D%0AMS44Mi0uNTQsMy4yNywxLjQ1LDEuNjMsMi43MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjky%0D%0AIDAuMDMpIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMjk0LjcsNDEuNThjLTEuNDUtMS44MS05%0D%0ALjI0LS45MS0xMi42OC0uMzYtMS4wOS4xOC0xLjI3LS43My0uMTgtMS40NSw2LjE2LTQuMzUsMTYu%0D%0ANDktMy4wOCwxNy43Ni0xLjYzcy0uMzcsMTEuNzctNi4xNiwxNi42N2MtLjkxLjcyLTEuODIuMzYt%0D%0AMS4yNy0uNzMuOS0zLjQ0LDMuOC0xMC42OSwyLjUzLTEyLjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0%0D%0AZSgtMS45MiAwLjAzKSIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTE5MC4xNCwzMS4xNWE0LjI4%0D%0ALDQuMjgsMCwwLDEtMi45NSwxLjEyLDQsNCwwLDAsMS0zLjI3LTEuNTMsNi4zOCw2LjM4LDAsMCwx%0D%0ALTEuMjItNC4wOCw2LjU0LDYuNTQsMCwwLDEsMS4yMy00LjE2LDQsNCwwLDAsMSwzLjMtMS41Niw0%0D%0ALjU3LDQuNTcsMCwwLDEsMS43NC4zMyw0LjI1LDQuMjUsMCwwLDEsMS40NSwxbC4yNS0xaDIuNjRW%0D%0AMzEuNjNhNS4yLDUuMiwwLDAsMS01LjY0LDUuNjgsOSw5LDAsMCwxLTQtMVYzNC4yMWExMywxMyww%0D%0ALDAsMCwzLjc2LjY4LDIuOCwyLjgsMCwwLDAsMi4xLS42NywzLjEsMy4xLDAsMCwwLC42NS0yLjE5%0D%0AWm0tMi0xLjI2YTMuMjksMy4yOSwwLDAsMCwxLS4xNiwzLjU1LDMuNTUsMCwwLDAsLjk0LS40NVYy%0D%0AMy44N2E0LDQsMCwwLDAtMi4xMS0uNTVjLTEuNDEsMC0yLjEyLDEuMDgtMi4xMiwzLjI1YTQuNiw0%0D%0ALjYsMCwwLDAsLjU1LDIuNTFBMS45NCwxLjk0LDAsMCwwLDE4OC4xOCwyOS44OVoiIHRyYW5zZm9y%0D%0AbT0idHJhbnNsYXRlKC0xLjkyIDAuMDMpIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMTk4LjA4%0D%0ALDE5LjUzYTEuOSwxLjksMCwwLDEtMS4zNC0uNDYsMS44LDEuOCwwLDAsMSwwLTIuNTEsMi4xOCwy%0D%0ALjE4LDAsMCwxLDIuNjgsMCwxLjgsMS44LDAsMCwxLDAsMi41MUExLjksMS45LDAsMCwxLDE5OC4w%0D%0AOCwxOS41M1ptLTEuNjEsMTNWMjEuMjdoMy4yMlYzMi41MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRl%0D%0AKC0xLjkyIDAuMDMpIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMjA1LjY3LDMyLjUxLDIwMS40%0D%0ALDIxLjI3aDMuNDFsMi40LDguMzYsMi40NC04LjM2SDIxM2wtNC4yNCwxMS4yNFoiIHRyYW5zZm9y%0D%0AbT0idHJhbnNsYXRlKC0xLjkyIDAuMDMpIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMjE2Ljc4%0D%0ALDI3LjY3YTIuNzgsMi43OCwwLDAsMCwuODgsMi4xLDMuODYsMy44NiwwLDAsMCwyLjQ5LjY1LDEy%0D%0ALjgyLDEyLjgyLDAsMCwwLDMuNDMtLjU1VjMyYTcuMjIsNy4yMiwwLDAsMS0xLjg0LjYxLDEwLjY5%0D%0ALDEwLjY5LDAsMCwxLTIuMjEuMjIsNS42Myw1LjYzLDAsMCwxLTQuMjYtMS41Miw2LjE3LDYuMTcs%0D%0AMCwwLDEtMS40Ni00LjQ0LDYuMTgsNi4xOCwwLDAsMSwxLjQ1LTQuMzgsNS4yNCw1LjI0LDAsMCwx%0D%0ALDQtMS41Niw0LjQ3LDQuNDcsMCwwLDEsMy4zNSwxLjIsNC42Niw0LjY2LDAsMCwxLDEuMTgsMy40%0D%0AMiw5LjE0LDkuMTQsMCwwLDEtLjA3LDEuMSw4LjIyLDguMjIsMCwwLDEtLjE1LDFabTIuNC00LjUx%0D%0AYTIuMjgsMi4yOCwwLDAsMC0xLjcxLjY1LDMsMywwLDAsMC0uNzEsMS44OGg0LjMxdi0uMzdRMjIx%0D%0ALjA3LDIzLjE2LDIxOS4xOCwyMy4xNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjkyIDAuMDMp%0D%0AIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMjMyLjczLDMyLjUxbC0uMjYtMWE1LjMyLDUuMzIs%0D%0AMCwwLDEtMS41OCwxLDQuNTgsNC41OCwwLDAsMS0xLjcyLjM2LDMuNjIsMy42MiwwLDAsMS0yLjYx%0D%0ALS45MiwzLjI1LDMuMjUsMCwwLDEtMS0yLjQ2LDMuMywzLjMsMCwwLDEsLjUzLTEuODYsMy41NSwz%0D%0ALjU1LDAsMCwxLDEuNTItMS4yNyw1LjU2LDUuNTYsMCwwLDEsMi4zMy0uNDYsMTAuODEsMTAuODEs%0D%0AMCwwLDEsMi4zMy4yOXYtMS4xYTEuODIsMS44MiwwLDAsMC0uNDItMS4zOSwyLjM2LDIuMzYsMCww%0D%0ALDAtMS41NC0uMzcsMTMuMjQsMTMuMjQsMCwwLDAtNCwuNjhWMjEuODZhOC4zNSw4LjM1LDAsMCwx%0D%0ALDIuMDUtLjY3LDEzLDEzLDAsMCwxLDIuNS0uMjUsNSw1LDAsMCwxLDMuMzEuOTEsMy42MiwzLjYy%0D%0ALDAsMCwxLDEsMi44N3Y3Ljc5Wm0tMi42Ni0xLjhhMywzLDAsMCwwLDEuMTMtLjI0LDQuMjMsNC4y%0D%0AMywwLDAsMCwxLjA5LS42NlYyNy44OWExMS41NywxMS41NywwLDAsMC0xLjc0LS4xNWMtMS4yNyww%0D%0ALTEuOTEuNTEtMS45MSwxLjU0YTEuNDQsMS40NCwwLDAsMCwuMzcsMS4wNkExLjQ3LDEuNDcsMCww%0D%0ALDAsMjMwLjA3LDMwLjcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuOTIgMC4wMykiLz48cGF0%0D%0AaCBjbGFzcz0iY2xzLTciIGQ9Ik0yNDcsMzIuNTFsLTEuOTQtNy45LTIsNy45SDI0MGwtMy41OC0x%0D%0AMS4yNGgzLjM5bDEuODcsOC4xMiwyLTguMTJoMi44OGwyLjA3LDguMTQsMS43Ni04LjE0aDMuM2wt%0D%0AMy42MSwxMS4yNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjkyIDAuMDMpIi8+PHBhdGggY2xh%0D%0Ac3M9ImNscy03IiBkPSJNMjYxLjg2LDMyLjUxbC0uMjctMWE1LjE1LDUuMTUsMCwwLDEtMS41Nywx%0D%0ALDQuNTksNC41OSwwLDAsMS0xLjczLjM2LDMuNjEsMy42MSwwLDAsMS0yLjYtLjkyLDMuNTYsMy41%0D%0ANiwwLDAsMS0uNDUtNC4zMiwzLjUyLDMuNTIsMCwwLDEsMS41MS0xLjI3LDUuNjEsNS42MSwwLDAs%0D%0AMSwyLjM0LS40NiwxMC44MSwxMC44MSwwLDAsMSwyLjMzLjI5di0xLjFhMS44MiwxLjgyLDAsMCww%0D%0ALS40Mi0xLjM5LDIuMzYsMi4zNiwwLDAsMC0xLjU0LS4zNywxMy4yNCwxMy4yNCwwLDAsMC00LC42%0D%0AOFYyMS44NmE4LjQsOC40LDAsMCwxLDItLjY3LDEzLjE5LDEzLjE5LDAsMCwxLDIuNTEtLjI1LDUs%0D%0ANSwwLDAsMSwzLjMxLjkxLDMuNjIsMy42MiwwLDAsMSwxLjA1LDIuODd2Ny43OVptLTIuNjYtMS44%0D%0AYTMsMywwLDAsMCwxLjEzLS4yNCw0LjIzLDQuMjMsMCwwLDAsMS4wOS0uNjZWMjcuODlhMTEuNTcs%0D%0AMTEuNTcsMCwwLDAtMS43NC0uMTVjLTEuMjgsMC0xLjkxLjUxLTEuOTEsMS41NGExLjQ0LDEuNDQs%0D%0AMCwwLDAsLjM3LDEuMDZBMS40NywxLjQ3LDAsMCwwLDI1OS4yLDMwLjcxWiIgdHJhbnNmb3JtPSJ0%0D%0AcmFuc2xhdGUoLTEuOTIgMC4wMykiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik0yNzAsMzIuNjls%0D%0ALTQuNDUtMTEuNDJoMy40MWwyLjUxLDguNCwyLjM4LTguNGgzLjMyTDI3Mi40LDM0YTUuOCw1Ljgs%0D%0AMCwwLDEtMS41NywyLjUxLDMuNTIsMy41MiwwLDAsMS0yLjMzLjc3LDYuNyw2LjcsMCwwLDEtMi4x%0D%0AMy0uMzVWMzQuNzhjLjQ3LDAsLjg4LjA2LDEuMjUuMDZhMi4xOCwyLjE4LDAsMCwwLDEuNDMtLjQy%0D%0ALDMuMzgsMy4zOCwwLDAsMCwuODYtMS40OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjkyIDAu%0D%0AMDMpIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMjg0LjU0LDMyLjUxVjE2LjIzaDMuMjF2NS45%0D%0AYTQuNzMsNC43MywwLDAsMSwxLjUtLjg3LDQuODYsNC44NiwwLDAsMSwxLjY5LS4zMiw0LjEsNC4x%0D%0ALDAsMCwxLDMuMzgsMS41Niw2LjYsNi42LDAsMCwxLDEuMjQsNC4yMyw4LDgsMCwwLDEtLjU3LDMu%0D%0AMUE0Ljg5LDQuODksMCwwLDEsMjkzLjM0LDMyYTQuMTUsNC4xNSwwLDAsMS0yLjQ5Ljc5QTUsNSww%0D%0ALDAsMSwyODksMzIuNGEzLjgyLDMuODIsMCwwLDEtMS40Ny0xbC0uMjksMS4xWm01LjM3LTkuMTVh%0D%0ANC4xNyw0LjE3LDAsMCwwLTIuMTYuNnY1Ljc4YTQsNCwwLDAsMCwyLjE2LjYsMiwyLDAsMCwwLDEu%0D%0AODEtLjg0LDQuNjksNC42OSwwLDAsMCwuNTgtMi42NCw0LjgsNC44LDAsMCwwLS41Ny0yLjY2QTIs%0D%0AMiwwLDAsMCwyODkuOTEsMjMuMzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS45MiAwLjAzKSIv%0D%0APjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTMwMy4wNiwzMi44NEE1LjMzLDUuMzMsMCwwLDEsMjk5%0D%0ALDMxLjI3YTYuMTgsNi4xOCwwLDAsMS0xLjQ3LTQuMzlBNi4xNiw2LjE2LDAsMCwxLDI5OSwyMi41%0D%0AMWE2LjExLDYuMTEsMCwwLDEsOC4xOCwwLDYuMTIsNi4xMiwwLDAsMSwxLjQ4LDQuMzcsNi4xNCw2%0D%0ALjE0LDAsMCwxLTEuNDgsNC4zOUE1LjMxLDUuMzEsMCwwLDEsMzAzLjA2LDMyLjg0Wm0wLTIuNDZj%0D%0AMS41NCwwLDIuMzEtMS4xNywyLjMxLTMuNXMtLjc3LTMuNDgtMi4zMS0zLjQ4LTIuMzEsMS4xNi0y%0D%0ALjMxLDMuNDhTMzAxLjUyLDMwLjM4LDMwMy4wNiwzMC4zOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRl%0D%0AKC0xLjkyIDAuMDMpIi8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMzE3LjgyLDMyLjIzYTcuMjEs%0D%0ANy4yMSwwLDAsMS0yLjY2LjQ2LDMuOCwzLjgsMCwwLDEtMi43Ni0uODgsMy43MiwzLjcyLDAsMCwx%0D%0ALS44OS0yLjczVjIzLjY1aC0xLjY5di0ybDEuNzgtLjM2LjQ4LTMuMDhoMi42NHYzaDN2Mi4zOGgt%0D%0AM3Y1LjI4YTEuMjIsMS4yMiwwLDAsMCwuMzUsMSwyLDIsMCwwLDAsMS4xOS4yOCwxMC4yMiwxMC4y%0D%0AMiwwLDAsMCwxLjU2LS4xM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjkyIDAuMDMpIi8+PC9z%0D%0Admc+" />
    </div>

    <div style="display: flex; background-color: transparent; margin-bottom: 0px; background: #fff; z-index: 1;">
      <a target="#botOptions" id="showOptions" class="botNavLink active">
        Settings
      </a>
      <a target="#log" id="showLog" class="botNavLink">
        Activity Log
      </a>
      <a target="#botFrameContainer" id="showBotFrame" class="botNavLink">
        Browser
      </a>
      <a target="#winningsList" id="showWinnings" class="botNavLink">
        Winnings
      </a>
    </div>

    <div id="botOptions" class="botPanel active">
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">
        Amazon Account
      </div>
      <label for="accountDropdown">Account Email</label>
      <select id="accountDropdown" style="background-color: #fff;width: 100%;height: 31px; padding: 3px 7px; line-height: normal;">
        <option disabled>─────</option>
        <option id="addNewAccount" value="Add New Account" style="display:block;">Add New Account</option>
      </select>
      <div style="display: flex; padding-bottom:10px;">
        <div id="" style="display: flex; flex-direction: column; width: 50%">
          <div id="accountAddressContainer" style="display: flex; flex-direction: column; padding-top: 8px;">
            <label for="">Shipping Address</label>
            <div id="accountAddress" style="height: 103px; padding: 3px 7px; border: 1px solid rgb(206, 212, 218); display: none; flex-direction: column; border-radius: 3px;">
              <span id="fullNameSpan"></span>
              <span>
                <span id="street1Span" placeholder="Street and number, P.O. box, c/o."></span>
                <span id="street2Span" placeholder="Apartment, suite, unit, building, floor, etc."></span>
              </span>
              <span>
                <span id="citySpan"></span>
                <span id="stateSpan"></span>
                <span id="zipSpan"></span>
              </span>
              <span>United States</span>
              <span>
                <span>Phone: </span>
                <span id="phoneSpan"></span>
              </span>
            </div>
          </div>

        </div>
        <div style="display: flex; flex-direction: column; width: 50%; padding-left: 25px; padding-top: 29px;">
          <button id="editAddress" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6);  height: 31px; margin-bottom:5px;">
            Change Shipping Address
          </button>
          <button id="changePassword" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6);  height: 31px; margin-bottom: 5px;">
            Change Password
          </button>
          <button id="deleteAccount" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  height: 31px;">
            Delete Account
          </button>
        </div>
      </div>
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">
        Giveaway Filter
      </div>
      <div style="display: flex; padding-bottom:10px;">
        <div id="giveawayFilter" style="display: flex; flex-direction: column;">
          <div><input id="disableFollow" name="disableFollow" type="checkbox" /><span> Don't Follow Authors</span></div>
          <div><input id="disableKindle" name="disableKindle" type="checkbox" /><span> Skip Kindle Books</span></div>
        </div>

      </div>
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">
        Captcha Solving
      </div>
      <div>
        <label for="twoCaptchaKey">
          2Captcha Key
          <a style="font-weight: 400;" href="https://2captcha.com?from=7493321">
            (referral link)
          </a>
        </label>
        <input id="twoCaptchaKey" style="width: 50%; box-shadow: 0 0 0 100px #fff inset !important;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here" />
      </div>
    </div>

    <div id="log" class="botPanel" style="flex-direction: column; padding: 0px; overflow: hidden;">
      <div id="logHeader" style="display: flex; flex-direction: row; justify-content: space-between; font-weight: 400; padding: 1px 16px; width: 100%; border-bottom: 1px solid #ccc;">
        <div style=" display:flex; flex-direction: column;">
          <span style="display: flex;" id="lifetimeEntries"><b>Total Entered: </b><span style="margin: 0px 5px;" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"></span></span>
          <span style="display: flex;" id="totalWins"><b>Total Winners: </b><span style="margin: 0px 5px;" id="totalWinsValue"></span><span id="currentSessionWins"></span></span>
        </div>
        <button id="clearLog" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding-left: 1em; padding-right: 1em; margin: 6px 0px;">
          Clear Log
        </button>
      </div>
      <div id="logContent" style="display: flex; flex-direction: column; text-align: left; overflow-y: scroll; height: 100%; max-height: 375px;"></div>
      <a><svg id="autoscroll" style="display: none; position: absolute; bottom: 5px; right: calc(50% - 25px);" class="a" xmlns="https://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><defs><style>.cls-1{fill:#2196f3;}.cls-2{fill:#fff;}</style></defs><title>Untitled-1</title><circle class="cls-1" cx="12.5" cy="12.5" r="12.5"/><path class="cls-2" d="M20.5,12.5l-1.4-1.41-5.6,5.58V4.5h-2V16.67L5.93,11.08,4.5,12.5l8,8Z" transform="translate(0 0)"/></svg></a>
    </div>

    <div id="botFrameContainer" class="botPanel" style="padding: 0px;">
      <iframe id="botFrame" style="width: 1200px; height: 800px; transform: scale(0.5); transform-origin: top left; border: 0;" src="https://www.amazon.com/ga/giveaways"></iframe>
    </div>

    <div id="winningsList" class="botPanel" style="padding: 0px;">
      <div id="winningsHeader" style="text-align: center; font-size: 17px; font-weight: 400; padding: 16px;">
        <span id="winningsHeaderCount">0 Giveaways Won</span>
        <span style="margin: 0px 5px;"> - </span>
        <span id="winningsHeaderValue">$0 Total Value</span>
      </div>
      <div style="background: #eaeded; flex: 1;">
        <div class="listing-page" style="width: 1200px; height: 800px; transform: scale(0.5); transform-origin: top left; border: 0; flex: 1;">
          <div class="listing-desktop">
            <div class="listing-info-desktop">
              <div>
                <ul id="winningsListContainer" class="listing-info-container"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style=" border-top: 0px solid #ddd; background-color: #fff; display: flex; justify-content: space-between; padding: 10px 16px; text-align: left;">
      <button id="bugReport" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Report Bug</button>
      <button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>
      <button id="stop" style="display: none; background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>
    </div>
  </div>
</div>

<div id="modalOverlay" style="visibility: hidden; font-family: 'Helvetica Neue', Arial, sans-serif; position: fixed; width: 100vw; height: 100vh; top: 0px; bottom: 0px; z-index: 99999; background: rgba(0,0,0,0.75); overflow: hidden; display: flex; flex-direction: column; justify-content: center;">
  <div id="addressModal" style="display:none;">
    <div style="background: #fff; width: 300px; margin: auto; border: 0px solid transparent; border-radius: .28571429rem;">
      <div id="addressForm" style="display: flex; flex-direction: column; width: 100%;">
        <div style="font-size: 17px; font-weight: 700; padding: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
          Shipping Address
        </div>
        <div id="addressFormBody" style="display: flex; flex-direction: column; width: 100%; padding: 8px 16px;">
          <div style="padding-bottom: 5px;"><label for="fullName">Full Name</label><input id="fullName" name="fullName" type="text" class="required" /></div>
          <div style="padding-bottom: 5px;"><label for="street1">Street Address</label><input id="street1" name="street1" type="text" class="required" placeholder="Street and number, P.O. box, c/o." /></div>
          <div style="padding-bottom: 5px;"><input id="street2" name="street2" type="text" placeholder="Apartment, suite, unit, building, floor, etc." /></div>
          <div style="padding-bottom: 5px; width: 100%;"><label for="city">City</label><input id="city" name="city" type="text" class="required" /></div>
          <div style="padding-bottom: 5px; width: 100%;"><label for="state">State / Province / Region</label><input id="state" name="state" type="text" class="required" /></div>
          <div style="padding-bottom: 5px; width: 100%;"><label for="zip">Zip Code</label><input id="zip" name="zip" type="text" class="required" /></div>
          <div style="padding-bottom: 5px;"><label for="phone">Phone number</label><input id="phone" name="phone" type="text" class="required" /></div>
        </div>
        <div style="font-size: 17px; font-weight: 400; padding: 10px 16px; border-top: 1px solid #eee; display: flex; flex-direction: row; justify-content: space-between;">
          <button id="cancelAddressButton" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6);  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Cancel
          </button>
          <button id="saveAddressButton" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="accountModal" style="display:none;">
    <div style="background: #fff; width: 300px; margin: auto; border: 0px solid transparent; border-radius: .28571429rem;">
      <div id="accountForm" style="display: flex; flex-direction: column; width: 100%;">
        <div style="font-size: 17px; font-weight: 700; padding: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
          Account Info
        </div>
        <form id="accountFormBody" style="display: flex; flex-direction: column; width: 100%; padding: 8px 16px; margin-bottom: 0px;">
          <div style="width: 100%; padding-bottom: 5px;">
            <label for="amazonEmail">Email</label>
            <input id="amazonEmail" name="amazonEmail" type="text" placeholdertype="Amazon Email" class="required" autocomplete="nope" />
          </div>
          <div style="padding-bottom: 2px; width: 100%;">
            <label for="amazonPassword">Passsword</label>
            <input id="amazonPassword" name="amazonPassword" type="password" placeholdertype="Amazon Password" class="required" autocomplete="nope" />
          </div>
        </form>
        <div style="font-size: 17px; font-weight: 400; padding: 10px 16px; border-top: 1px solid #eee; display: flex; flex-direction: row; justify-content: space-between;">
          <button id="cancelAccountButton" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6);  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Cancel
          </button>
          <button id="saveAccountButton" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="deleteAccountModal" style="display:none; ">
    <div style="background: #fff; width: 300px; margin: auto; border: 0px solid transparent; border-radius: .28571429rem;">
      <div id="deleteAccountDiv" style="display: flex; flex-direction: column; width: 100%;">
        <div style="font-size: 17px; font-weight: 700; padding: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
          Delete Account
        </div>
        <div style="display: flex; flex-direction: column; width: 100%; padding: 8px 16px;">
          Are you sure you want to delete this account? All giveaway history and shipping information will be permanently deleted.
        </div>
        <div style="font-size: 17px; font-weight: 400; padding: 10px 16px; border-top: 1px solid #eee; display: flex; flex-direction: row; justify-content: space-between;">
          <button id="cancelDeleteAccountButton" style="background-color: #DDD; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6);  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Cancel
          </button>
          <button id="confirmDeleteAccountButton" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 0.75em; line-height: 0.75em; font-size: 0.85rem;">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`
