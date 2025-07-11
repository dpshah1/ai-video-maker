from manim import *

class KonigsbergBridge(Scene):
    def construct(self):
        title = Text("The Königsberg Bridge Problem").scale(0.8)
        subtitle = Text("Birth of a Theory").scale(0.6).next_to(title, DOWN)

        bridge_image = Circle(radius=0.5).scale(1.5).next_to(subtitle, DOWN)

        self.play(Write(title))
        self.play(Write(subtitle))
        self.play(FadeIn(bridge_image))

        self.wait(4.0)