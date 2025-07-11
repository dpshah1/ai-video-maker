from manim import *

class ProposeAndReject(Scene):
    def construct(self):
        title = Text("The Propose-and-Reject Algorithm", font_size=36)
        subtitle = Text("A Discrete Dance", font_size=24)
        
        title.move_to(UP * 1)
        subtitle.next_to(title, DOWN)

        self.play(Write(title), Write(subtitle))
        self.wait(1)

        dancers = VGroup(*[Circle(radius=0.5, color=BLUE).shift(LEFT * i) for i in range(5)])
        self.play(FadeIn(dancers))

        for dancer in dancers:
            self.play(dancer.animate.scale(1.5).set_color(ORANGE), run_time=0.5)
            self.play(dancer.animate.scale(1/1.5).set_color(BLUE), run_time=0.5)

        self.wait(1.1)

        self.play(FadeOut(dancers), FadeOut(title), FadeOut(subtitle))
        self.wait(0.5)