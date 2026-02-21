<template>
    <v-container fluid class="pa-0">
        <v-row dense class="banners">
            <v-col cols="auto" class="pa-1">
                <v-img :src="require('@/assets/banners/luhas.gif')" tile="add me to ur website!" width="88" height="31"
                    class="banner-img" cover />
            </v-col>
        </v-row>
        <v-row dense class="banners">
            <v-col v-for="(banner, index) in shuffledBanners" :key="index" cols="auto" class="pa-1">
                <a v-if="banner.url" :href="banner.url" target="_blank" rel="noopener noreferrer">
                    <img v-if="/^https?:\/\/111logged\.in\//.test(banner.src)" :src="banner.src"
                        referrerpolicy="no-referrer" width="88" height="31" class="banner-img" />
                    <v-img v-else :src="banner.src" width="88" height="31" class="banner-img" cover />
                </a>
                <img v-else-if="/^https?:\/\/111logged\.in\//.test(banner.src)" :src="banner.src"
                    referrerpolicy="no-referrer" width="88" height="31" class="banner-img" />
                <v-img v-else :src="banner.src" width="88" height="31" class="banner-img" cover />

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const banners = ref([
    {
        src: new URL('@/assets/banners/megaworld.png', import.meta.url).href,
        url: 'https://www.megaworld.xyz',
    },
    {
        src: 'https://twinningl00m.neocities.org/buttons/murrumurgreen.png',
        url: 'https://twinningl00m.neocities.org',
    },
    {
        src: 'https://88by31.neocities.org/music/ae.gif',
        url: 'https://kaizoslumber.xyz/',
    },
    {
        src: 'https://www.stern32.xyz/_app/immutable/assets/stern32.DJWu0nD8.gif',
        url: 'https://www.stern32.xyz',
    },
    {
        src: 'data:image/gif;base64,R0lGODlhWAAfAKIGAP//mf//AP+ZzP8A//8AmZmZAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTlBMEVGN0I1OUYzMTFFQUIxN0VENzNDMTFEMzg3OTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTlBMEVGN0E1OUYzMTFFQUIxN0VENzNDMTFEMzg3OTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowYWM4NDZhMi0wMzM4LWYyNDEtYjJiZS1hNjg0ZDkxYmViYzIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowYWM4NDZhMi0wMzM4LWYyNDEtYjJiZS1hNjg0ZDkxYmViYzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFCgAGACwAAAAAWAAfAAAD/wi63P4wykljASHrzbv/YCiOXnGRaKquoYmxcCx3rkcMOJ7e+bD3vhAPKKp1hroRkqhkgpZOjlEDzT2BWFE1acP2PtMMbzP+IMlfMzdQ7gapVtpJnKbH0Wu8e30+5tl/AVNtHIR2V296bouFgYOBgImHLIZwkpOKUnORapeVJJ+cfpJDJZuhlaFakJ+GoY+XmJYwqIFbkLCdo7Sstl6xGrC/d7OUw3V4v2Cnx8SyP82xrrjM0bvG1teWsbmMmSq10n+f3drFK+He5xvljZ6Qou665s8Z7d92wK294u/c1fPc8UG2Dt+zUnJexJMn6tbAIOkaHit2rxihW4oilnFIETAgo1RRJmlMsoVhmBkoU444qbKlS3ubXspU6cKEzZs4c+rcybOnz59AgwodSrQozgQAIfkEBQoABgAsAAAAAAEAAQAAAwJoCQAh+QQFCgAGACwAAAAAWAAfAAAD/yi63P4wykkjESPrzbv/YCiOHnGRaKquoYmxcCx3rlcEOJ7eebD3vhAPKKp1hroRkqhkgpZOjlEDzT2BWFE1acP2PtMMbzP+IMlfM3dQ7gapVtpJnKbH0Wu8e30+5tl/A1NtHIR2V296bouFgYOBgImHLIZwkpOKUnORapeVJJ+cfpJDJZuhlaFakJ+GoY+XmJYwqIFbkLCdo7Sstl6xGrC/d7OUw3V4v2Cnx8SyP82xrrjM0bvG1teWsbmMmSq10n+f3drFK+He5xvljZ6Qou665s8Z7d92wK294u/c1fPc8UG2Dt+zUnJexJMn6tbAIOkaHit2rxihW4oilnFIETAgo1RRJmlMsoVhmBkoU444qbKlS3ubXspU6cKEzZs4c+rcybOnz59AgwodSrQozgQAIfkEBQoABgAsAAAAAAEAAQAAAwJoCQA7',
    },
    {
        src: 'data:image/gif;base64,R0lGODlhWAAfAJEAAAAAAAAAAIj/AAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFZAAAACwAAAAAWAAfAAACsIyPqcvtD6OctNqLs968+w+GlmCQgYCW6bkmqAmrJjLD6/uRNc2fy+4LKnTBWdHTYtmWjBpOOfQxlUYNsdTDNoCxn1SrrWa6z7KDK/M6p6K2+w2Pj190uf0nvusPyb2f9RcIOES3VlUnCNGXRmPD55h4Vgj52DioErmV15eU0pmXeWk5ivkZiofaOEmFeEr6KlrpKpkqW2q0eJq7eOOEOQv76/L0mAt8jJysvMzcbFEAACH5BAVkAAAALA0ABQA+ABUAAALcDGBoIuHsgjhgKipRvZTRM0WHaCSIpaHjpErhe35g2VSmptzOtnv79snUHpqb7bQQ5XYmU03VkWVAseln+NSNElzqTwbEWDILTpQW+inB7Lb7DY/L5/S6PYI32vduzyjMEBjYIQgFMshHWPGk2Oa3KOP3yOcBAWjYeJgJmVjJqJmXkLYw9qfZKUgF+gX2kLZ1Spm6Vcaa0qrjkniIiNKLQupjZoFZV6gKaVsmlTu5d3xpZopnE0q6ywnmY7R82KPibBe+KhWWdP2NPZ6sFwTUk1JMt/7rexX0Lf9RAAA7',
        url: 'https://yesterweb.org/no-to-web3/',
    },
    {
        src: 'https://88by31.neocities.org/awareness/free_palestine.gif',
        url: 'https://docs.google.com/spreadsheets/d/1vtMLLOzuc6GpkFySyVtKQOY2j-Vvg0UsChMCFst_WLA/edit?gid=1653697245#gid=1653697245',
    },
    {
        src: 'https://hellnet.work/8831/img/buttons/alfred_harris2000_button.gif',
    },
    {
        src: 'https://88by31.neocities.org/anime/madoka.gif',
    },
    {
        src: 'https://freegames-online.info/images/banners/banner03.png',
        url: 'https://freegames-online.info/',
    },
    {
        src: 'https://mesoscale.neocities.org/images/links/archive.png',
        url: 'https://archive.org/',
    },
    {
        src: 'https://mesoscale.neocities.org/images/88x31/defund_badge.gif',
    },
    {
        src: 'https://mesoscale.neocities.org/images/88x31/linux_powered.gif',
    },
    {
        src: 'https://88by31.neocities.org/drugs/w33d.gif',
    },
    {
        src: 'https://88by31.neocities.org/games/puyo.png',
    },
    {
        src: 'https://hellosailor.neocities.org/index%20files/RaveNow3.gif',
    },
    {
        src: 'https://hellosailor.neocities.org/website%20assets/jolyne%20icon.gif',
        url: 'https://www.stuxnet.lgbt/',
    },
    {
        src: 'https://88by31.neocities.org/games/yumenikki3.gif',
    },
    {
        src: 'https://88by31.neocities.org/games/scp.png',
    },
    {
        src: 'https://88by31.neocities.org/misc/2020SUCKS.png',
    },
    {
        src: 'https://88by31.neocities.org/misc/hailsatan.gif',
    },
    {
        src: 'https://88by31.neocities.org/misc/ilift.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/hardcorehappines.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/miku.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/funny.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/plasticlove.png',
    },
    {
        src: 'https://88by31.neocities.org/music/nm.png',
    },
    {
        src: 'https://88by31.neocities.org/music/pc.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/3rdworld.png',
    },
    {
        src: 'https://88by31.neocities.org/music/co.png',
    },
    {
        src: 'https://88by31.neocities.org/music/ca2.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/tsb.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/2814.gif',
    },
    {
        src: 'https://loa2k.neocities.org/btns/mk.gif',
    },
    {
        src: 'https://loa2k.neocities.org/btns/+w.gif',
    },
    {
        src: 'https://forum.agoraroad.com/index.php?media/kaarbs-gif.28180/full',
        url: 'https://kaarbs.xyz/',
    },
    {
        src: 'https://doffy.neocities.org/button_1.gif',
    },
    {
        src: 'https://anlucas.neocities.org/piracy.gif',
    },
    {
        src: 'https://loa2k.neocities.org/btns/vs.gif',
        url: 'https://vhsmidnightstyle.bandcamp.com/',
    },
    {
        src: 'https://88by31.neocities.org/music/len.gif',
    },
    {
        src: 'https://feign.neocities.org/image/stamp/bulletproof%20love.gif',
    },
    {
        src: 'https://feign.neocities.org/image/stamp/rhino-beetle.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/eatsleep.gif',
    },
    {
        src: 'https://plasticdino.net/buttons/graphicdesign.png',
    },
    {
        src: 'https://88by31.neocities.org/music/vk.gif',
    },
    {
        src: 'https://88by31.neocities.org/music/lemondemon.png',
    },
    {
        src: 'https://vivivi.leprd.space/assets/ublocko-8831.png',
    },
    {
        src: 'https://vivivi.leprd.space/assets/linux-8831.png',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/button_tupachq1.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/cardsbutton.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/transnow2.gif',
    },
    {
        src: 'data:image/webp;base64,UklGRhwDAABXRUJQVlA4IBADAACwDwCdASpYAB8APpFAmkmlo6IhJXgNmLASCWgAzLGOQwG2N56TTGt4zrJMiB2QJgUhdlDGFf8P7qvaD9RewH+r3+r9ar17ftJ7Hf6zG5zercdsOp1CxM76mj/Tr6vCSi9h9sdd5FyB+dXWMwOp9tW+dAt0rPFsJnB2qUrR/XIpjGeBZAeOAAD+/ZdO/k6eHyhid8KMWBsGUvQVhtAvIDawv5cbR5wt1kvsYhJGXk9rSOg4nf/h16rW9ueuU6RIlVcY3EG38HHIdghS6kkXp9eZvLSghXX4nB/Q2/ssvIdya/wp41EDYSxscLEkj9Hgj1iS3cmbM06zdi2rSUD4/CptUHsG2SdRuIKVvvzjti5Nnzb1QCtEBRj7nbkq6vTtqwSPf+N/X6zzm8uro8RHWvyoH66raGQ3Tuc7F+m54jAA7zUHXDNDAn1P+ymGfzorDDxvBVA/xLhE/nhjAUcBH8ZvP9b+9z/5zQvlcKE9VGZ4vCh/Pllx7Wue7jvWNevnseX66f5rpN58pdVuez1M8sO8fwHxfQWwFD9cv+RwPrGmnXKAiait9MzIAt9wPYoZetIKoA7sAof5a2gUBRuxJoXY61P7//uIeNYFNx/9so9fE8jzEIsA5XxeeaCg1nRO3vMUIkTv7u36O/4U3/fntBQDTtlU50+yvXwMj734OBB22Zyrd1+y/sD5Tz2Wny4Cb68wfQsASgh3qPSdajSqZ8RwrNY5pBsnzs0AFfjoqfMXu4Kf02pg1PqghuslYqj386eMD03zQTL+d1LLhjc4tlBiCC/NpCSWpeKcJKvxxs+rHof79/IX/xFSr2KBK2IHWc3TvoOu7o94ORC76qXW8kuBG1NNHDOxD7nD3QT1HOSf2NVLVspSs+ERlGildkRdaCGXhRSKbrujI3As47+7L0xWR9MZM83vFAfTkk0ybw8fnZODC9NG2djxJA5toXRn38g1UKieq/m6udYGb1gTCFI1PALwbz2YpS/TC4CKSyip52RHghZD/7mUf/MBPZbIAS3JAH4bMu8fSIREqaWgAAAA',
    },
    {
        src: 'data:image/webp;base64,UklGRi4CAABXRUJQVlA4ICICAABQCgCdASo8ABQAPpE+mUkloyIhMBQIALASCWgAnTL2hoFYuyC5qNr6MylwMjFNH8hP08L/Ji8LKEzepS9ekMCboVZeTz/JC8nXgQOpfbKWAv7IOfLZtcDg8SAAAP14Nsw8pdY6JyeIvDioPD+qJz1jEQPfWffYYBe7tUy6PkuXVkqG1ZRvUO5HuLR7c/v9QEwR6kXevU4B7AMl11+SOu917mtnzfz7/5MJ8rz0PdaLV3rkp4C6MXFP4AaEPVCFWtid76fw5WmgQWMxLrBnrawopqXitKWnq4814lPRQnMeBkEcrN+r0yy2TlcnbxILs7VGE/Qn3aqC95v62E7iOEZ6Z/K35nmmZdzs9jUpK3kR/ft4gFns9tD25J765/RVdBK8c6TCadmBuW0QRgYdnmCXMmJjcYfINZrjdjKqnAekPf2kJgIDBCjM96+IWAN7OAyyAZt8SP/AY3wbfe+VoQEysxW7xHlYodJrhZGVLpUdJX3dtbhAMqO1bfekCx2HVotbMbwAgMFgwRBtyupGfixxV8MQdnUPiiZLMqT/U7MpQGx7femfD41IZxO6hlB0zmPmdmUmc3OWKyfTzYnmX0jvQtt5elpDX9IPHlJvqKPjFKATT2vNkB+PTVQYku0eAjAPCN9r391H/i5XjKovi473EiEB0NXp7Uw5Odf6HaGBpLCnKwEfdN8jvuKbcnxAunoT0QKGIGdu7Fq3PttzCc/QAAA=',
    },
    {
        src: 'data:image/webp;base64,UklGRg4CAABXRUJQVlA4WAoAAAAQAAAAVwAAHgAAQUxQSCAAAAABDzD/ERFCSRtJkLSVtsY/dIsPRvR/AtQbGdg/zUANAFZQOCDIAQAA0A0AnQEqWAAfAD6RQJdIpaQiIS1WakiwEglpABXjX8dmwP7T+JrlIP5LxM/9V5tH8p5d/ib/I+4L/Iv49/e/zg/vnyZ9Qb+lLCjxwFgj7n7DH2JsWJbSbCypj7fOS79RMvKlSHv+CyyOtomhBcn7UBpFor6WSYAA+ny/3/tv9VqrpCjHMUrDGl2n1ybzQITaIOw6SyOUj3X40B3AZ9QJgEM/2B2U5rfdLo0WqBbf86n2iGZb6Koum1mD+6GYEMxd7ftGio3uwAn2pqCTsEGzY99UXFHLMsfug0kBOjAlhW6u//ELuukcfxF403p5jy9vhDi2/QeI3M+ZU0eB/ad7VByuF6tXXDTVrtiH/3XFPmJYsHIJX9lXIyk8EgT8wkQ3blL//zWid20NP+7Ff4oiZD19U3vDdBl7JCSYc5xfs+b9h25Vw+kqJHatJOxdPifdKp36wbMbBQRgn8g3qBx8PxD1rX1snu/uHf/+IN89Jj53XCTDZkffekf/HyjkPic1wbvrdbV/X0NWbnmqgdfAz4C9ckAlGPs143IgWPZH8qzCe5brZDyvB/7ylwCYPCe350qmAoO/F/Xadlu/dxrUOpuFF9jmEAAA',
    },
    {
        src: 'data:image/webp;base64,UklGRrgDAABXRUJQVlA4IKwDAADwEQCdASpYAB8APpFAmkmlo6IhKrQLALASCWYAs7M5AJBCvgbfzngNMl3l+0ITEeHWyR7gDYU/o3ew/ztxT89z/P8vX5b/k/+/7gP8q/qn/P67/ocfpWMptNecno+9tUOxiA1zG0E7sprykW4VmSEnfr298E8ABwF4ixpQTDHDKyplmnMU/EnQa+3RgPOb+7c7QMc27ar4wAD+9m/FdoikJlNJcW/eetJ1fHQ8Bk9A7Z9TQFfq7exVPW8uZtUBoqj/+cq2Qv/H3x4DkAwyFzWI0+WKSRhottr/zdurF7VYmedp8WbADi3ff8R6ppohr4LcvjnW/8n8UbnF86mUG1FHPNqa/y9/9eutts5jTvy1ku8MJIvPujv/8q//rFPNDCwoxdeQh2KWT7NvmnUUdCaWVIajdHa9m0TRSiQp6GtbtyBE0o+OH/m3Ax8mfyW34vaKT5Bd4iKSgJX9W/fR+QMZFHFGyR61GEPKKGRm1BsdoG6P8degQ7TVPAfxJ2RrJsYiiXIp56oZfmLmnbJWG+8wC1XY1+D8coF8lm50KiJ3XxWs/ywBW4lPQ+noQxfiP+uXQrFW4YUrOzC8tXZ25XnAW4Aj9WxKv2X/hiGvII1+6Q8Pd6OjYDjtiqWUV9Al3vDbT7QYrO7MVv72z1ueQyPXVDymQPSt+1OrEARii59U8gYKe8UgZDVAYpGIS3bg5rVAd8wWXf687VKkXJWDbaj/j4jbikS/nGBQkt5g7vdge6hNh+XDBvmU2Hb+9ez5heyHbXS8SPV8dRMXoH/QPMg4cL1bQLLS2RmegPuo3yJ6CVu8tbOPA3yR9HoPQ/ddHfrl/sU7Qphq0y7PWIBQFmzMg1pwkY+xOvV8PgQjcr6IFPWlqYanX/+rROF9zDH/hCv/Y2ac61Kjxu68AeNNkrFzDaYVGVppIj2mPuWzoLeIv7H39+JKOMzRyvajDQtTL6+Ed5gE9vkPxP78QP5TjU30a1qvuK/bfAnfmmn9HbLeKNCuHwK5k4az4iZCKD/GkmmQUmfbLCQMYfYhzifekK0+IQSqP2HxhpG0KpXRsFdHsyS83Uo1i0bE5EruWmuyos14LaQJ82uu28Z+wvk8Z5C7SLhzKwbi6kKy9i3gRNmF/5K0WpNqP9XdPDliFuS1JbCH0Rlz9Cy3HvhDtIfz9D/2AHAbNatArVwXSYjlwTQabU3D0uiwlF9ccn600RCu7DL+7cd+q2oY38/vqi3gy3eOZc62GprRkPtfYAAA',
    },
    {
        src: new URL('@/assets/banners/yugoslavia.gif', import.meta.url).href
    },
    {
        src: 'data:image/webp;base64,UklGRsACAABXRUJQVlA4ILQCAABQDACdASpYAB8APok2lkelIyIhMBgOqKARCUAXwHEPW1cPjiCXGBW7oAQzTzNYEAppVBIDMzmMT/CmiAcvizDLTcsId4aq/PRik9+BHKdDT1dO3qV3lpCAx/P7Hb0OJMfFjdml1cQDtWffgAD+/uIjkT5G0Yk/5R1k4zCtMslXGP6NGhMMlrEXZWDSaXdeahXcYVeMx0TXdc+xcCJqeafe9wMpyX+yW5rFSvoT/IIvKrWObHy5tDC+EapzxjWxrCZL6/LK+o9agHYoXSegAo/u2A/AkC4KmQlKFOHl4UJ1wLS1IrOHB2e1847Fxcch+FXbvs88DJffxPBimbwPstxU367eqWzhrQtCBrkJUz0uw/gMxkNIdHtojLv2TcjAfA+YLFTNVomlg3TFoAONxJ+B+lLxs8BnbE1Unm7P+RHZIv2F0ZX8T6BcOhcbHrv3BqU75Zqy/h2PU0Ho2luRbchVzL7eTPe6Rtsbh/ApJrpeKBs5a9Q8DbwzIqfbCYKdFkn0AIx9WMn4G7JB7Tt1NDx5zJV6oxyfDBMH0LSv9MWbsXSZcT0DYkw0XOCGJTTuIZDjP2ClEGSLhUXQ7C/FIS79IEIP9bUFnhC/YAIX7V0rcS5n3ZBK0Vvp/ukdSVtKV1+SQuIj2rKPaWHz+kRFDE7JSQE8/1niKr5i6meMHA9xMvPhvDAMQqQ4cCtNMZXiGUZnunJKwtEHyJ14s4i+qBGrVqPbBFVAWwVEGdnvUyIKAT+rljG6BqtO7LGDhX9lpEkz376cqz3BNzMp5PXH5v0+4vzuXX34yHJ6IOEnIwhZjAHY0K6ksX5hVofhxbSp6HOpacaG3kVc7orK7W7qqPdfCHvTy0Yu9/NxaucLx1ikOCVhTv8vAXRBdnljyI5qkon9qIUMAdkePrDevVzrhBlxwAAAAA==',
    },
    {
        src: 'data:image/webp;base64,UklGRoADAABXRUJQVlA4IHQDAAAQFQCdASpYAB8APpE4mkkloyKhKrv6ALASCWkAFeO/yDtM/unKVvz/8d2qnrvkN/IN1B/dO8A6ASA7/Cdyrxh3+c9Jv6r/meQA/o/+W+5X3of2j8yP8B7Wfxv+ofrz8Av8q/lP+h/tH70/5H5OfUt6Bv6kGcVoabh5Y2wtSy0EVx7DY1QQjkQ2TBr8RQrC+4Xhg/51wQzbE05XPjHf9opvrO3GwAh4QEeT+KdUuEwybbgA0P/IrXO2h0Qqghask0GLT4B9xcpKSF637pdNI3pbdqAXjip3OkKBPsqytVX89hD8DHyv/H9Od26kbJknHlTEjvsfdZHup+W5LfLfTXybdo8J2BNM/QjveA3/iNjlvuoRIwj87iFYBc9brDwxF1sW6CnkxthsfI+JCthT2fWS7b2ep20YIPSl+xfwrKjF5b5v4SIic78ZierYK1Zhcg4S9F4Rvc81U9krwL16FvXfzKrntmzGkgnSlT6i/xPXRJKDMyHqTPPY+RpTXOeyY0WiTek5pFC3226HbYb+iwJElA6qv7+bh8aXMCUPPQjnURpnrcE8iIDH7gw/fsrU9U8FG311jeppjaxW6HQvFip5rVTUuSFyeexSXk48qbP714yNUfvrr+efj5/lWOBFf03xuuuGQ817Iz/v94wSaY50XanuXORXs1t6EAkjwpEvgz2SXr4p8gkB+9/R23nDMho29e3e011+waHhyvs9aCs3G7fCAPOFLvRVtqL8tqvgy8reWwroMFVT2AN/tCF/p1bND6hlaBiuEkrhACu/4uuhF6vJdXdgvWJJmhDtw2dvhuZOcZwd6VO/TfuXPdDQfqA5lp1Bzi/vRLSUVDWsvV2P/2kmwyPY/ePJ82xsr9onyqndF531lW2+sB2Cm8Heizt0EtSKRWXu3ykESCqk3KZ+9df5VLKMvLWe6EVCY3G+LfxpbiA0quSUmOvDhpc5SPF3X2ousnlRfUY3ziTD2xoo7REUJaCmaaC1djlzrGFZyV+Nih0qu3wdrz1ijJPeOSC5IJAfaAtk36Zrji9I/u10KGiMyLeB7O6rHC/b2+3hVFKFZfN0cniWnAN5f6Y74e7rtLfHvJo3fXkyaiUS7dY7MBrr40TVS90+0I2WLzbXPHefi2b78Y36+hYWQzl3UCAOhH3nHXC434wozppm9gHvcAAAAA==',
    },
    {
        src: 'https://111logged.in/img/button/animegirls.gif',
    },
    {
        src: 'data:image/webp;base64,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',
    },
    {
        src: 'https://111logged.in/img/button/cinnam.gif',
    },
    {
        src: 'https://111logged.in/img/button/cinnamonoll.gif',
    },
    {
        src: 'data:image/webp;base64,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'
    },
    {
        src: 'data:image/webp;base64,UklGRu4DAABXRUJQVlA4IOIDAAAQEwCdASpYAB8APo04l0elI6IhMBgNUKARiWwAyi/tLb+3cEQYaEBtmPMB0FvQA/tf9u6yD0APLM9kP9uq7n0OXnk+b+6cIOwJvMPcvMvggPCgLj5xfpj2CekUmhAc0oQZakxfN+6Hu55DjWrlkidJPJeK7RGd4nXY91ood7vYWCwXIYazWV3xsL3iaICkSpPm6/k7qbVnAFumxXK87nqYoAD+/H9Rf1xW6EAekiFDAD1lreyRpub+3f33TRhj05jRiXqE3T3J27xVMfOjD/e3vJaZAnPbyztfKKb91iYBxxNedymBZLUL+Wr57KDRlyltuhfJmU23xJcTv1qAoaHTPt/zaGDnl1Jg6IFBCHUM1ztqyHHAE0r0IBtIHT3zc0407GE8IQNNJfeTN843o3q93RU//Gch+tiAA5VpEaOFWI/mlmJ/PapR9WN0xxqhvBv9Dvqrhk5q8olwwZHb1snZsc2K34+IhD7gf1v9GG/UK5ZA+VZYjMsrBRuycf5hrfOUNnSFGv5EZRHiZ4ggcQ94gT0+x7FQ0iOMLgDGM8CdwTrM/RHrCqmVlUAa3rGE3XOfI/L2LerKzM44WbTISDOI1c8by/W0pPW8c8BZyjeuSPZuy/VTnOKhlZpfeFTrA9T+lAxZmDn0mFugnkTy7AzNUL8e65rUC9rON8GL4hTGP1wv91x2VA1twJeNxFLO9X4Oet8RH48Vkcv+0X/PdU3o+fgrfwpaFbdgJUnsXqdyP0RrWr//S5CGi3ojo1OxWsnM4mofJ6+Hmjwln2QT7Ym93G/H/BMg/L7PutPhu68VIUwd0Dx+906gzOUU8Yk+iP12/xIyLHKb//pcbI7Ul5XL3KSDNKfn4+XDE2I8h6wgttCBBt5Z/16OAnfHbW1Ef4poyM2FWmuGLMhTD8L/vh1yN4n/NJ4itSV4ZkKgK1mjumtvrCdMVzW1Iwu/XjgvZzOFcGPlWHQ/dRqjAt3wuXNi3REiF0Dpd/5/5y3x35L012jfF95uwLKa+C/focM1QRywb2dIO1uOcsBeBpZEotwzLE4bZv1nhtceJK2SqV9EhP1UmgKqW838wFQKSbYT83TBr5itv8IaX7zWynjJxIelQ5Wc8Qi1gTwL88miBbEevvY39/wQhMhqeNpdL6rzkr+S42UGurCXX/1X6NSZ8c1aLOopFuZ1soJQ1Up45OuWnCSwl+cnuXnumS2Qu9sjcLT9vkpcZakjQ+Un821EpI6ywH9bkviAqOvbLL7sFptYjjAqa5v47xi4mGXY8DwqjO8TWOoOQxS3Fu9EVZyrj/zFZxLQtF0806T498yXfiYxGAAA'
    },
    {
        src: 'https://maia.crimew.gay/badges/maia.crimew.gay.png',
        url: 'https://maia.crimew.gay/',
    },
    {
        src: 'https://versary.town/badges/sucks.gif',
    },
    {
        src: 'https://utsuho.rocks/img/tor.gif',
        url: 'https://zj4rnhlqqftmby75ts3x2w7xqpkotb6opdbstpb7d5yfzcxirrev6fyd.onion/',
    },
    {
        src: 'https://utsuho.rocks/img/tfc.gif',
        url: 'https://www.thefreecountry.com/'
    },
    {
        src: 'https://blackwings.neocities.org/navi01.gif',
        url: 'https://fauux.neocities.org/',
    },
    {
        src: 'https://wilton.neocities.org/dmyslogo.png',
        url: 'https://dismissyourself.bandcamp.com',
    },
    {
        src: 'https://kendalls.garden/bye2Site/Images/smoshnet.gif',
        url: 'https://kendalls.garden/',
    },
    {
        src: 'https://dj-subaruu.neocities.org/buttons/5ubaruu-36.gif',
        url: 'https://5ubaruu.neocities.org/x   ',
    },
    {
        src: 'https://wilton.neocities.org/max-payne-logo-font-download1-1200x675.jpg',
        url: 'http://gldio.com/wrkz/max_payne/',
    },
    {
        src: 'https://c678924.neocities.org/images/bliss3three.gif',
        url: 'https://bliss3three.neocities.org/',
    },
    {
        src: 'https://aspyn.gay/assets/badges/other/ralseidoobie.gif',
    },
    {
        src: 'https://cdn.myportfolio.com/bef57c3d-da80-473f-bd67-df1c8922d722/c81d3430-2e57-4f2d-9fce-d0f114a5af72_rwc_0x0x2048x2048x4096.png?h=bcf98aa9cd14e6aca36ed8d0a8442dd8',
        url: 'https://alenaprinz.com/',
    },
    {
        src: 'https://hl2.sh/badges/twopaws.gif',
    },
    {
        src: 'https://hl2.sh/badges/kagi.png',
        url: 'https://kagi.com/',
    },
    {
        src: 'https://hl2.sh/badges/foobar2000.png',
    },
    {
        src: 'https://notnite.com/buttons/jellyfin.gif',
        url: 'https://jellyfin.org/',
    },
    {
        src: 'https://notnite.com/buttons/lowtiergod.png',
    },
    {
        src: 'https://88by31.neocities.org/anime/thirdimpact.png',
    },
    {
        src: 'https://unlife.nyx.land/static/img/ccru-banner.png',
        url: 'http://www.ccru.net/index.htm',
    },
    {
        src: 'https://unlife.nyx.land/static/img/web-banner-88x32.png',
        url: 'https://unlife.nyx.land/',
    },
    {
        src: 'https://magentahardcore.com/imgsAssets/banners/htmldream.gif',
    },
    {
        src: 'data:image/webp;base64,UklGRioFAABXRUJQVlA4IB4FAACQGgCdASpYAB8APo08mEelI6KhLVZtsKARiUAaFhiRANtX4kvrD7rB6nO8hf6evv/pP45+c/hB8+ezmcX+5H378qOQH2+/w3oI/zX+zbwTV7xU/ln+37m70A+XL1Jfxz/U+pH+Z/wHd3/QD4AP45/Ov73/Zv3H/vXw1f6H+T84/zv/0/8N8BX8w/qn/W/X/3kfX76I37YEabGETHN7Jczm00m5m9/4LLDmSvbmctWtxzagCjkwssGM4l3t0yw6Dk39uPb32hPUciN2eGWHs++Ta7TVycS45D5XB1I8UAD+/bzKjF8bn9iy/+wES4An2G1AkofPBJXpUD+g22+1tPgQYwaTR2jx27BIcIDuiBfVhWPGDD2WLGqTxghwMDPqqLsQ6AW48o0YYoRtj8MksU064LFic74KXM+uPMP44RrJXMk7D3M7VMts48KHwgmTs2c0+RzqKaNxVVyp82qo92aSdJJjZ31mo6LVuvE1hO/FIPwek5nYxfTtxLc3aMFqn0o1EXGmGS/fGaUOX/mPJWyjAGWwj/TNGnQoOtPOOlrWyQch8XLyM8FhrX7WfLfXY2D++m4P0yifqmZXhUQZeB6fhNC/Im+mXyq4Ot+pv8MsjQ7WvxBjvC/LVo8NyrtzzD/xDYERnh/4PYm1a+/tHAaFE5mwwIXaUKqaA1kiH5cMYSC/xKuPAjoT/hzafYDN/G9biMd1s034/iNIZNGfofN1MZrfjudr//U9peHCO7o/ldcIndrgqVPpINlQTjI+z//dp+lGQwJ+TnB8hE+fP1Pt5/6gG9HjhP9ziMlaz2VRG/OhPCsVjaZNqZhV7SdsyH71CAcOKEVC0+9gZ5jSQVJ0I+ma4GzRxrS+RMr4eF21C+RD9oiCLn3y0Kn/ypffRKxGHXAmCf4nPoMy6XOPJUmH4GTYBpV8jPBg+F1uNl/MwSSHjWLWiH+Z7K/rjCvpcbrBtan2Q0fQesKlOqBKAw7bfEeEwZojJaWmXQVsRxygK2n1jjBoqmyc9H/9/BNff+/xAGz0HkutLW8K8r/SJG5fN5rnDMOEAZeE/2rZiYvhjVkHPtNCCEQ+tAFb1dQJURyiTv+7UeGb9BKOArVdK5Yl+qZ6D9jQ1Dpr71FFWmIANe3aV8KB2voD85SjyFlrxnkgbAwiBTWY7weLU9DQ2S1Wv6cIJ6CddHSLO2udJ+9fVQr/FfCQz+soSYVn/8uif+OujrBnD/11qDkx4ZpGdEr4kLdP3tgivipn9BckXoV+8JiNZy7VpRJr8/SCFXyQC2BKC9BQ/OqeGhPXn33gY3Mx8nYXfOjQhdV8MjufqKG/E+v0xBqpa2Oyn/4uNPMvaZr8KTPqXlyPAF6YNyb1AYRyZmhmaUYKBhyf4RINIwXbTQvtoYa2WCdfLYNVrnx3FF5PvZ88UDYQJ4Qnlm0V5jbjf5jFvjkecAKjZt8s5BCb2ySegv1RSdg9ulZ3zhOCcuGofwwSP/BQwSp5H6e0Pti7FKx/Hn43+NTsB0MR4sbNSU+G5C5SrTFnDNX+sJ+PQoJwp/2fLnhYD5y7DceNyzWY/6sCb1flbmqCY5M7axhE2BazXDCzr5ELA4ktty1WDVlMT9T/mriU4h2EnvIF8VlyIRmsBFQEt8Tt12FR4HJ/hUAaEy95ZcruOMl7vJcqXVhChiUhLfrw5+e36BbNOlhK8+pExcVbh7TNFtw8IPKWF3n78WZ5ohZDBeVxuSiAJf3T3MimxDnkr/SyngAAAA==',
    },
    {
        src: 'data:image/webp;base64,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',
        url: 'https://you-are-idiot.github.io/',
    },
    {
        src: 'https://radio.cock.institute/assets/logo/logo.webp',
        url: 'https://radio.cock.institute/',
    },
    {
        src: 'https://driftt.neocities.org/049.gif',
    },
    {
        src: 'https://i.postimg.cc/X7s4yBZj/burial.gif',
    },
    {
        src: 'https://konetska.neocities.org/fyeah.png',
    },
    {
        src: 'https://konetska.neocities.org/hitman.gif',
    },
    {
        src: 'https://dannarchy.com/now/77granddad.png',
    },
    {
        src: 'https://magentahardcore.com/imgsAssets/banners/evilnetnow.gif',
    },
    {
        src: 'https://file.garden/ZRWmljccGFWyKu1T/buttons/d_now.gif',
        url: 'https://dannarchy.com/',
    },
    {
        src: 'https://file.garden/ZRWmljccGFWyKu1T/buttons/button(1).png',
        url: 'https://sourgummywormz.neocities.org/',
    },
    {
        src: 'https://endlessvoid.lol/decorations/gifcities-button.gif',
        url: 'https://gifcities.org/',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/fuckmm.gif',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/klown.gif',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/aniquake.gif',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/korncom.gif',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/gayvampires.gif',
    },
    {
        src: 'https://predictable1993.neocities.org/blinkies/mcr.gif',
    },
    {
        src: 'https://boypussy.neocities.org/layout/deco/buttons/bp%20button.gif',
        url: 'https://boypussy.neocities.org/',
    },
    {
        src: 'https://eldritch-exorcist.neocities.org/website/223.jpg',
    },
    {
        src: 'https://eldritch-exorcist.neocities.org/website/feednottheai.gif',
    },
    {
        src: 'https://eldritch-exorcist.neocities.org/website/digitalblasphemy.gif',
    },
    {
        src: 'https://eldritch-exorcist.neocities.org/website/silenthill.png',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/aponow.gif',
    },
    {
        src: 'https://shroom.ink/images/bottom/oldmanyaoi.jpg',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/thevoid.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/theorb.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/bu12.gif',
    },
    {
        src: 'https://88x31.datakra.sh/img/random/durstloescherultras.gif',
    },
    {
        src: 'https://88x31.datakra.sh/img/random/VA-11-Hall-A.gif',
    },
    {
        src: 'https://88x31.datakra.sh/img/random/ilovegothgirls.gif',
    },
    {
        src: 'https://88x31.datakra.sh/img/random/fckafd.gif',
    },
    {
        src: 'https://alyx.sh/images/hrt-geocities-buttons/powered-by-debian.gif',
        url: '/server',
    },
    {
        src: 'https://adryd.com/static/buttons/gh.gif',
    },
    {
        src: 'https://i.postimg.cc/pVfRB1SL/hope-left-me-button.gif',
        url: 'https://store.steampowered.com/app/2268470/HOPE_LEFT_ME/',
    },
    {
        src: 'https://i.postimg.cc/506jycq3/NA-web-button.gif',
        url: 'https://noagreements.bandcamp.com/',
    },
    {
        src: 'https://111logged.in/img/button/99gif.png',
        url: 'https://99gifshop.neocities.org/',
    },
    {
        src: new URL('@/assets/banners/peo.png', import.meta.url).href,
        url: 'https://post-everything.online/',
    },
    {
        src: 'https://yayazizi.neocities.org/button.gif',
        url: 'https://yayazizi.neocities.org/',
    },
    {
        src: 'https://read-nekojiru.neocities.org/media/BACKG-moshed-07-01-23-06-29-14-moshed-07-01-23-09-26-306.gif',
        url: 'https://read-nekojiru.neocities.org/',
    },
    {
        src: 'https://capstasher.neocities.org/88x31Buttons/dawa.gif',
    },
    {
        src: 'https://capstasher.neocities.org/88x31Buttons/caramelldansen.gif',
    },
    {
        src: new URL('@/assets/banners/freemusicnow.png', import.meta.url).href,
        url: 'https://lucida.to/',
    },
    {
        src: 'https://vmfunc.re/button.png',
        url: 'https://vmfunc.re/',
    },
    {
        src: new URL('@/assets/banners/cryptopsy.png', import.meta.url).href,
    },
    {
        src: 'https://vmfunc.re/button.png',
        url: 'https://vmfunc.re/',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/newgrounds.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/pspu.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/ah.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/banner2.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/benis.gif',
    },
    {
        src: 'https://cyber.dabamos.de/88x31/asexuals_now.gif',
    },
    {
        src: 'https://i.postimg.cc/3JxjLLNj/lopster-yuki-button-2.gif',
    },
    {
        src: 'https://moya.cafe/images1/buttons/bbs-face.gif',
    },
])

const shuffledBanners = ref([])

function shuffleArray(arr) {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

onMounted(() => {
    shuffledBanners.value = shuffleArray(banners.value)
})
</script>

<style scoped>
.banners {
    justify-content: center;
    align-items: center;
}

.banner-img {
    image-rendering: pixelated;
    background-color: black;
}
</style>
